import asyncHandler from "express-async-handler";
import { utcToZonedTime } from "date-fns-tz";
import { format } from "date-fns";
import transactions from "../models/pfm-transactions-models.js";
import dashboard from "../models/pfm-models.js";

//@desc Get Transactions Data by User.
//@route GET /api/PFM/transactions/:userid
//@access public
const getPfmTransactionsByUser = asyncHandler(async (req, res) => {
  console.log(
    "get-transactions-called",
    new Date().getFullYear(),
    new Date().getHours()
  );

  let utcDate = new Date();
  const timezone = "Asia/Kolkata";
  const zonedDate = utcToZonedTime(utcDate, timezone);

  const pattern = "yyyy-MM-dd HH:mm:ss.SSS 'GMT' XXX (z)";
  const output = format(zonedDate, pattern, { timezone });

  // Below find operation will give us transactions record by current month and year
  const data = await transactions
    .find({
      $expr: {
        $and: [
          { $eq: ["$user_id", req.params.userid] },
          {
            $eq: [
              {
                $month: "$createdAt",
              },
              new Date(output).getMonth() + 1,
            ],
          },
          {
            $eq: [
              {
                $year: "$createdAt",
              },
              new Date(output).getFullYear(),
            ],
          },
        ],
      },
    })
    .sort({ createdAt: -1 });
  console.log("data :", JSON.stringify(data));

  res.status(200).json({ data });
});

//@desc POST Transactions Data by User.
//@route GET /api/PFM/transactions/:userid
//@access public
const createPfmTransactions = asyncHandler(async (req, res) => {
  const {
    transaction_type,
    transaction_amount,
    transaction_description,
    user_id,
  } = req.body;

  let currentAmount = 0;

  // get Data from dashboard collections.
  let currentDashboardData = await dashboard.find({ user_id: user_id });
  let dashboardData = currentDashboardData[0];
  console.log({ dashboardData });
  if (!dashboardData) {
    res
      .status(400)
      .json({ error: { message: "No-dashboard data found", dashboard: [] } });
    throw new Error(`No dashboard record found`);
  }
  // if (+dashboardData.grand_total > 0) {
  switch (transaction_type) {
    case "credit":
      console.log("credit case");
      let currentCreditAmount = +transaction_amount;
      currentAmount = +dashboardData.availableBalance + currentCreditAmount;

      // Update dashboard fields..
      dashboardData.transactions.credited += currentCreditAmount;
      dashboardData.availableBalance = currentAmount;
      dashboardData.grand_total += currentCreditAmount;
      break;

    case "debit":
      console.log("debit", dashboardData.grand_total);
      if (+dashboardData.grand_total === 0) {
        res.status(400);
        throw new Error(`Transaction has been declined. Insufficient balance.`);
      }
      let currentDebitAmount = +transaction_amount;

      if (currentDebitAmount >= dashboardData.availableBalance) {
        let currentAmountAfterCurrentBalanceDeduct =
          currentDebitAmount - +dashboardData.availableBalance;
        dashboardData.availableBalance = 0;
        if (currentAmountAfterCurrentBalanceDeduct >= +dashboardData.limit_pm) {
          let balanceAfterLimit =
            currentAmountAfterCurrentBalanceDeduct - +dashboardData.limit_pm;
          dashboardData.limit_pm = 0;
          if (balanceAfterLimit >= +dashboardData.total_savings) {
            let balanceAfterGrandTotal =
              balanceAfterLimit - +dashboardData.total_savings;
            dashboardData.total_savings = 0;
            dashboardData.grand_total =
              +dashboardData.availableBalance +
              +dashboardData.limit_pm +
              +dashboardData.total_savings;
            if (balanceAfterGrandTotal >= +dashboardData.grand_total) {
              // dashboardData.grand_total = 0;
              if (balanceAfterGrandTotal !== +dashboardData.grand_total) {
                // Here declined transaction...
                console.log("declined...");
                res.status(400);
                throw new Error(
                  `Transaction has been declined. Insufficient balance`
                );
              }
            } else {
              // result["grand_total"] =
              //   +dashboardData.grand_total - +dashboardData.grand_total;
            }
          } else {
            dashboardData.total_savings =
              +dashboardData.total_savings - +balanceAfterLimit;
          }
        } else {
          dashboardData.limit_pm =
            +dashboardData.limit_pm - +currentAmountAfterCurrentBalanceDeduct;
        }
      } else {
        dashboardData.availableBalance =
          +dashboardData.availableBalance - currentDebitAmount;
      }

      // Update dashboard fields..
      dashboardData.transactions.debited += currentDebitAmount;
      dashboardData.grand_total =
        +dashboardData.availableBalance +
        +dashboardData.limit_pm +
        +dashboardData.total_savings;

      if (+dashboardData.grand_total === 0) {
        dashboardData.transactions.debited = 0;
        dashboardData.transactions.credited = 0;
      }

      console.log(".............................................");
      console.log(dashboardData);
      console.log("..................................................");
      break;
  }

  // }
  // console.log({
  //   available_balance: dashboardData.availableBalance,
  //   ...req.body,
  // });

  const transactionAdded = await transactions.create({
    available_balance: dashboardData.availableBalance,
    grand_total: dashboardData.grand_total,
    ...req.body,
  });

  const result = await dashboard.findOneAndUpdate(
    { user_id: user_id },
    dashboardData
  );
  res.status(201).json({ ok: "ok" });
});

export { getPfmTransactionsByUser, createPfmTransactions };

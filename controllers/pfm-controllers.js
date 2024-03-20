import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import dashboard from "../models/pfm-models.js";
import transactions from "../models/pfm-transactions-models.js";

// here asyncHandler is used to remove try=catch block.
// whenever error occurs error will be therown to our error_handler.js file

//@desc Get Dashboard Data by user.
//@route GET /api/PFM/dashboard/:userid
//@access public
const getPfmDashboardByUser = asyncHandler(async (req, res) => {
  console.log("get...", req.params.userid);
  const data = await dashboard.find({
    user_id: req.params.userid,
  });
  console.log("data :", JSON.stringify(data));
  res.status(200).json(data);
});

//@desc Create new PFM
//@route POST /api/PFM//dashboard/:userid
//@access public
const createPFMDashboard = asyncHandler(async (req, res) => {
  console.log(`request body is ${JSON.stringify(req.body)}`);

  const { total_savings, salary_pm, limit_pm, availableBalance, user_id } =
    req.body;
  console.log(!req.body.total_savings, "total_savings");
  if (
    (!total_savings && total_savings !== 0) ||
    (!salary_pm && salary_pm !== 0) ||
    (!limit_pm && limit_pm !== 0) ||
    (!availableBalance && availableBalance !== 0) ||
    !user_id
  ) {
    console.log(JSON.stringify(req.body));
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const transactionsData = await transactions.aggregate([
    {
      $match: {
        user_id: {
          $eq: user_id,
        },
      },
    },
    {
      $group: {
        _id: {
          type: "$transaction_type",
        },
        count: {
          $count: {},
        },
        sum: {
          $sum: "$transaction_amount",
        },
      },
    },
  ]);

  let debitAmount = 0;
  let creditAmount = 0;
  console.log(transactionsData);
  if (transactionsData.length > 0) {
    let filterDebit = transactionsData.filter(
      ({ _id }) => _id.type === "debit"
    );
    filterDebit.length > 0
      ? (debitAmount = filterDebit[0]["sum"])
      : (debitAmount = 0);

    let filterCredit = transactionsData.filter(
      ({ _id }) => _id.type === "credit"
    );
    filterCredit.length > 0
      ? (creditAmount = filterCredit[0]["sum"])
      : (creditAmount = 0);
  }

  // console.log({ debitAmount });
  // console.log({ creditAmount });
  // console.log("..................");
  // console.log(transactionsData);
  // console.log("........................");

  let transaction = {
    transactions: { debited: debitAmount, credited: creditAmount },
  };

  // let finalObj = {
  //   total_savings,
  //   salary_pm,
  //   limit_pm,
  //   availableBalance,
  //   user_id,
  //   ...transaction,
  // };

  // console.log("final obj");
  // console.log(finalObj);

  let grand_total = availableBalance + limit_pm + total_savings;
  console.log({ grand_total });
  let base_limit_pm = limit_pm;
  const pfmDashboardCreate = await dashboard.create({
    grand_total,
    total_savings,
    salary_pm,
    limit_pm,
    base_limit_pm,
    availableBalance,
    ...transaction,
    user_id,
  });
  res.status(201).json(pfmDashboardCreate);
});

//@desc Get PFM
//@route GET /api/PFM/:id
//@access public
const getPFM_BY_ID = asyncHandler((req, res) => {
  res.status(200).json({ message: `Get PFM for ${req.params.id}` });
});

//@desc Update PFM
//@route PUT /api/PFM/dashboard/:id
//@access public
const updatePfmDashboard = asyncHandler(async (req, res) => {
  const _id = { _id: req.params.id };

  /*
    : NOTE : [20/MARCH/2024]
          
          Removed this statement to checkout when dashboard data updated.
          We do not need to mannually update base_limit_pm".
          So, today at 20/03/2024 I updated below line and commented out old line for future reference.
      
    const updateData = { ...req.body, base_limit_pm: req.body.limit_pm };
  */

  const updateData = { ...req.body };

  console.log(".....................");
  console.log(updateData);

  const result = await dashboard.findOneAndUpdate(_id, updateData);

  if (!result) {
    res.status(404);
    throw new Error(`ID: ${_id} not found for update`);
  }
  res.status(200).json({ message: `Update PFM for ${req.params.userid}` });
});

//@desc Delete PFM
//@route DELETE /api/PFM/:id
//@access public
const deletePFM = asyncHandler((req, res) => {
  res.status(200).json({ message: `Delete PFM for ${req.params.id}` });
});

export {
  getPfmDashboardByUser,
  createPFMDashboard,
  getPFM_BY_ID,
  updatePfmDashboard,
  deletePFM,
};

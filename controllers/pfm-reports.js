import asyncHandler from "express-async-handler";
import limit_pm_reports from "../models/pfm-reports-models.js";

//@desc GET Reports dashboard data of previous months.
//@route POST /api/PFM/reports/previousMonths/:userid
//@access public
const getPfmReportsByPreviousMonths = asyncHandler(async (req, res) => {
  console.log("reports called...");
  const data = await limit_pm_reports.find({ user_id: req.params.userid });
  console.log(data);
  res.status(200).json(data);
});

export { getPfmReportsByPreviousMonths };

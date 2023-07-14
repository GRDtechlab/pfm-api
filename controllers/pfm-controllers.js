import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import dashboard from "../models/pfm-models.js";
import user from "../models/users-models.js";

// here asyncHandler is used to remove try=catch block.
// whenever error occurs error will be therown to our error_handler.js file

//@desc Get User By ID
//@route GET /api/PFM/user/:id
//@access public
const getPfmUserById = asyncHandler(async (req, res) => {
  console.log(`Users request body is ${JSON.stringify(req.params.id)}`);
  const data = await user.find({});
  res.status(200).json(data[0]);
});

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
const createPFMDashboard = asyncHandler((req, res) => {
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
  const pfmDashboardCreate = dashboard.create({
    total_savings,
    salary_pm,
    limit_pm,
    availableBalance,
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
  const updateData = req.body;

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
  getPfmUserById,
};

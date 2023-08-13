import asyncHandler from "express-async-handler";
import records from "../models/pfm-records-models.js";

//@desc Get Recor Data by User.
//@route GET /api/PFM/record/:userid
//@access public
const getPfmRecordByUser = asyncHandler(async (req, res) => {
  console.log("get...", req.params.userid);
  const data = await records.find({
    user_id: req.params.userid,
  });
  console.log("data :", JSON.stringify(data));
  res.status(200).json(data);
});

//@desc POST Record Data by User.
//@route POST /api/PFM/record/:userid
//@access public
const createPfmRecord = asyncHandler(async (req, res) => {
  const { bank, user_id } = req.body;
  console.log(`Bank record is: ${JSON.stringify(bank)}`);

  const pfmRecordCreate = await records.create({
    bank,
    user_id,
  });
  res.status(201).json(pfmRecordCreate);
});

//@desc EDIT Record-Data by User.
//@route EDIT /api/PFM/record/:id
//@access public
const editPfmRecord = asyncHandler(async (req, res) => {
  const _id = { _id: req.params.id };
  const updateRecordData = req.body;

  if (!_id) {
    res.status(400);
    throw new Error("_Id filed is mandatory");
  }

  const result = await records.findOneAndUpdate(_id, updateRecordData);

  if (!result) {
    res.status(404);
    throw new Error(`ID: ${_id} not found for update`);
  }

  res.status(200).json({ message: `Edit PFM Record for ${req.params.id}` });
});

//@desc DELETE Record-Data by User.
//@route DELETE /api/PFM/record/:id
//@access public
const deletePfmRecord = asyncHandler(async (req, res) => {
  const _id = req.params.id;
  if (!_id) {
    res.status(400);
    throw new Error("_Id filed is mandatory");
  }
  const result = await records.findOneAndDelete({ _id });

  if (!result) {
    res.status(404);
    throw new Error(`ID: ${_id} not found for delete`);
  }

  res.status(200).json({ message: `Delete PFM for ${req.params.id}` });
});

export { getPfmRecordByUser, createPfmRecord, editPfmRecord, deletePfmRecord };

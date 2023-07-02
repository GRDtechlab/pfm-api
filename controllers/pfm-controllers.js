import asyncHandler from "express-async-handler";
// here asyncHandler is used to remove try=catch block.
// whenever error occurs error will be therown to our error_handler.js file

//@desc Get All PFM
//@route GET /api/PFM
//@access public
const getAllPFM = asyncHandler((req, res) => {
  res.status(200).json({
    salary: 19930,
    limit_to_save: 2000,
    current_balance: 8000,
  });
});

//@desc Create new PFM
//@route POST /api/PFM
//@access public
const createPFM = asyncHandler((req, res) => {
  console.log(`request body is ${JSON.stringify(req.body)}`);

  const { name, email, mob } = req.body;
  if (!name || !email || !mob) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  console.log("after error");
  res.status(201).json({ message: "New PFM data created." });
});

//@desc Get PFM
//@route GET /api/PFM/:id
//@access public
const getPFM_BY_ID = asyncHandler((req, res) => {
  res.status(200).json({ message: `Get PFM for ${req.params.id}` });
});

//@desc Update PFM
//@route PUT /api/PFM/:id
//@access public
const updatePFM = asyncHandler((req, res) => {
  res.status(200).json({ message: `Update PFM for ${req.params.id}` });
});

//@desc Delete PFM
//@route DELETE /api/PFM/:id
//@access public
const deletePFM = asyncHandler((req, res) => {
  res.status(200).json({ message: `Delete PFM for ${req.params.id}` });
});

export { getAllPFM, createPFM, getPFM_BY_ID, updatePFM, deletePFM };

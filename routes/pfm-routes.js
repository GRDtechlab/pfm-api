import express from "express";
import {
  createPFMDashboard,
  deletePFM,
  getPfmDashboardByUser,
  getPFM_BY_ID,
  getPfmUserById,
  updatePfmDashboard,
} from "../controllers/pfm-controllers.js";
import {
  getPfmRecordByUser,
  createPfmRecord,
  editPfmRecord,
  deletePfmRecord,
} from "../controllers/pfm-records.js";
const router = express.Router();

// Refer controllers folder for each code of the below rotes.

router
  .route("/dashboard/:userid")
  .get(getPfmDashboardByUser)
  .post(createPFMDashboard);
router.route("/:id").get(getPFM_BY_ID);
router.route("/dashboard/:id").put(updatePfmDashboard);
router.route("/:id").delete(deletePFM);
router.route("/user/:id").get(getPfmUserById);

router.route("/record/:userid").get(getPfmRecordByUser).post(createPfmRecord);
router.route("/record/:id").put(editPfmRecord).delete(deletePfmRecord);
export default router;

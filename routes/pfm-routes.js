import express from "express";

import {
  createPFMDashboard,
  deletePFM,
  getPfmDashboardByUser,
  getPFM_BY_ID,
  updatePfmDashboard,
} from "../controllers/pfm-controllers.js";

import {
  getPfmRecordByUser,
  createPfmRecord,
  editPfmRecord,
  deletePfmRecord,
} from "../controllers/pfm-records.js";

import {
  getPfmTransactionsByUser,
  createPfmTransactions,
} from "../controllers/pfm-transactions.js";

import {
  getPfmUsersByUser,
  addPfmUsersData,
  pfmUserLogin,
  pfmUserLogout,
  pfmCheckUserIsLoggedIn,
  pfmCheckEmailAvailability,
} from "../controllers/pfm-users.js";
import validateToken from "../middleware/validate-token-handler.js";

const router = express.Router();

router.route("/").get((req, res) => {
  console.log("Cron job from vercel executes on path /api/pfm");
  res.send("Hello world");
});

// Refer controllers folder for each code of the below rotes.

router.route("/user/:user_id").get(getPfmUsersByUser);
router.route("/user").post(addPfmUsersData);
router.route("/user/checkEmailAvailability").post(pfmCheckEmailAvailability);
router.route("/user/login").post(pfmUserLogin);
router.route("/user/userloggedin").post(validateToken, pfmCheckUserIsLoggedIn);
router.route("/user/logout").post(pfmUserLogout);

router
  .route("/dashboard/:userid")
  .get(getPfmDashboardByUser)
  .post(createPFMDashboard);
router.route("/:id").get(getPFM_BY_ID);
router.route("/dashboard/:id").put(updatePfmDashboard);
router.route("/:id").delete(deletePFM);

router.route("/record/:userid").get(getPfmRecordByUser).post(createPfmRecord);
router.route("/record/:id").put(editPfmRecord).delete(deletePfmRecord);

router
  .route("/transactions/:userid")
  .get(getPfmTransactionsByUser)
  .post(createPfmTransactions);

export default router;

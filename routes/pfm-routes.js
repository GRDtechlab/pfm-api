import express from "express";
import {
  createPFM,
  deletePFM,
  getAllPFM,
  getPFM_BY_ID,
  updatePFM,
} from "../controllers/pfm-controllers.js";
const router = express.Router();

// Refer controllers folder for each code of the below rotes.

router.route("/").get(getAllPFM).post(createPFM);
router.route("/:id").get(getPFM_BY_ID);
router.route("/:id").put(updatePFM);
router.route("/:id").delete(deletePFM);

export default router;

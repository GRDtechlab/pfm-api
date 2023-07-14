import mongoose from "mongoose";
// import { Schema } from "mongoose";
const pfmDashboardSchema = new mongoose.Schema(
  {
    total_savings: {
      type: Number,
      required: [true, "Please add total_saved filed"],
    },
    limit_pm: {
      type: Number,
      required: [true, "Please add limit_pm filed"],
    },
    salary_pm: {
      type: Number,
      required: [true, "Please add salary filed"],
    },
    availableBalance: {
      type: Number,
      required: [true, "Please add availableBalance filed"],
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

const dashboard = mongoose.model("dashboard", pfmDashboardSchema);

export default dashboard;

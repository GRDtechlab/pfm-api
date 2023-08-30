import mongoose from "mongoose";
// import { Schema } from "mongoose";
const pfmDashboardSchema = new mongoose.Schema(
  {
    grand_total: {
      type: Number,
      required: [true, "Grand_Total field is required."],
    },
    total_savings: {
      type: Number,
      required: [true, "Please add total_saved filed"],
    },
    limit_pm: {
      type: Number,
      required: [true, "Please add limit_pm filed"],
    },
    base_limit_pm: {
      type: Number,
    },
    salary_pm: {
      type: Number,
      required: [true, "Please add salary filed"],
    },
    availableBalance: {
      type: Number,
      required: [true, "Please add availableBalance filed"],
    },
    transactions: {
      debited: {
        type: Number,
      },
      credited: {
        type: Number,
      },
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

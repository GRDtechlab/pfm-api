import mongoose from "mongoose";

const pfmReportsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
    },
    grand_total: {
      type: Number,
    },
    total_savings: {
      type: Number,
    },
    limit_pm: {
      type: Number,
    },
    base_limit_pm: {
      type: Number,
    },
    salary_pm: {
      type: Number,
    },
    availableBalance: {
      type: Number,
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

const limit_pm_reports = mongoose.model("limit_pm_report", pfmReportsSchema);

export default limit_pm_reports;

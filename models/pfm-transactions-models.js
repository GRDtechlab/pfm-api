import mongoose from "mongoose";

const pfmTransactionsSchema = new mongoose.Schema(
  {
    transaction_type: {
      type: String,
    },
    transaction_amount: {
      type: Number,
    },
    transaction_description: {
      type: String,
    },
    available_balance: {
      type: Number,
    },
    grand_total: {
      type: Number,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    dashboard: {
      isUpdated: {
        type: Boolean,
      },
      dashboard_update_id: {
        type: String,
      },
      description: {
        type: String,
      },
      grand_total: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const transactions = mongoose.model("transaction", pfmTransactionsSchema);

export default transactions;

import mongoose from "mongoose";
const pfmRecordsSchema = new mongoose.Schema(
  {
    bank: {
      name: {
        type: String,
      },
      account_no: {
        type: String,
      },
      pan_no: {
        type: String,
      },
      ifsc_code: {
        type: String,
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

const records = mongoose.model("record", pfmRecordsSchema);

export default records;

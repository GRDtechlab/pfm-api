import mongoose from "mongoose";
// import { Schema } from "mongoose";
const pfmUsersSchema = new mongoose.Schema(
  {
    user_name: {
      fname: {
        type: String,
      },
      mname: {
        type: String,
      },
      lname: {
        type: String,
      },
    },
    user_email: {
      type: String,
      required: [true, "Please add limit_pm filed"],
    },
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("user", pfmUsersSchema);

export default user;

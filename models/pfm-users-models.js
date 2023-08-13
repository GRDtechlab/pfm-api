import mongoose from "mongoose";
// import { Schema } from "mongoose";
const pfmUsersSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    occupation: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Please add email filed"],
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("user", pfmUsersSchema);

export default user;

import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(
      "PFM Database connected ",
      connect.connection.host,
      connect.connection.name
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDb;

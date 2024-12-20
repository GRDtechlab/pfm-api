import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import router from "./routes/pfm-routes.js";
import errorHandler from "./middleware/error-handler.js";
import connectDb from "./config/db-connection.js";
import cronjob_update_balance_each_month from "./cron_jobs/reset-balance-every-month-end.js";

const app = express();
const dotEnv = config();
const port = process.env.PORT || 5001;

Intl.DateTimeFormat().resolvedOptions().timeZone;

app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:5173",
      "https://pfm-api.vercel.app",
      "https://pfm-tau.vercel.app",
    ],
  })
);

connectDb();

app.use(cookieParser()); // This is cookie middleware.

app.use(express.json()); // This is required to enable of getting data from client side to our apis.

app.use("/api/pfm", router); // here /api/pfm is our default route for all setup by middleware app.use

app.use(errorHandler); // This is middleware to handle global error handlers for apis.

app.listen(port, () => console.log("server-started... on port ", port));

// // Cron job

// cronjob_update_balance_each_month();

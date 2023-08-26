import { CronJob } from "cron";

const cronjob_update_balance_each_month = () => {
  // "00 00 00 1 * *", --  Below scrhedule will run at every start of the new month at 12:00 am.
  const job = new CronJob(
    "00 24 14 26 * *",
    () => {
      console.log("cron-job running...");
    },
    null,
    true,
    "Asia/Kolkata"
  );
};

export default cronjob_update_balance_each_month;

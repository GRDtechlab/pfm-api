import { CronJob } from "cron";

// This is cron file to use for running for schedule tasks.
// We are using new verce.json cron jobs. so for now we skip this.

const cronjob_update_balance_each_month = () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log(
    { timezone },
    new Date().getHours(),
    new Date().getMinutes(),
    new Date().getTime()
  );
  // "00 00 00 1 * *", --  Below scrhedule will run at every start of the new month at 12:00 am.
  const job = new CronJob(
    "00 10 14 26 * *",
    () => {
      console.log("cron-job running...");
    },
    null,
    true
  );
};

export default cronjob_update_balance_each_month;

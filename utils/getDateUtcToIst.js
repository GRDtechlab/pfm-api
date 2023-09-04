import { utcToZonedTime } from "date-fns-tz";
import { format } from "date-fns";

const getIST_Date = (
  timezone = "Asia/Kolkata",
  pattern = "yyyy-MM-dd HH:mm:ss.SSS 'GMT' XXX (z)"
) => {
  let utcDate = new Date();
  const zonedDate = utcToZonedTime(utcDate, timezone);
  const output = format(zonedDate, pattern, { timezone });
  return output;
};

export default getIST_Date;

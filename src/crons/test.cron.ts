import { CronJob } from "cron";

const handler = () => {
  console.log("CronJob started");
};

export const testCron = new CronJob("*/5 * * 8 * *", handler);

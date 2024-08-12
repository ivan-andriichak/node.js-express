import { oldVisitorCron } from "./old-visitor.crone";
import { removeOldPasswordsCron } from "./remove-old-passwords.crone";
import { removeOldTokensCron } from "./remove-old-tokens.crone";
import { testCron } from "./test.cron";

export const jobRunner = () => {
  testCron.start();
  removeOldTokensCron.start();
  removeOldPasswordsCron.start();
  oldVisitorCron.start();
};

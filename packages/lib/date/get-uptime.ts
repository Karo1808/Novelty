import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";

dayjs.extend(duration);

export function getUptime(startTime: number) {
  const diffInMilliseconds = Date.now() - startTime;
  const durationObject = dayjs.duration(diffInMilliseconds);
  return `${durationObject.hours()} hours ${durationObject.minutes()} minutes ${durationObject.seconds()} seconds`;
}

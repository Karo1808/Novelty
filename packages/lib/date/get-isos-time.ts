import dayjs from "dayjs";

export function getIsosTime() {
  return dayjs(Date.now()).toISOString();
}

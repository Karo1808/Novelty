import dayjs from "dayjs";

export function getIsosTime() {
  return dayjs(Date.now()).toISOString(); // Ensure it uses the mocked Date.now
}

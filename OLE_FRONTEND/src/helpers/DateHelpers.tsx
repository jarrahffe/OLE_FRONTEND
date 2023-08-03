import moment from "moment";

// Maps days from the start of the currently viewed week to their respective dates in locale time
function mapDaysToDate(weekViewOffset: number) {

  const startOfWeek = moment().day(1).add(weekViewOffset, "week");
  const format = "YYYY-MM-DD";
  const dateMap: Map<string, string> = new Map();

  dateMap.set("mon", startOfWeek.format(format));
  dateMap.set("tue", startOfWeek.add(1, "day").format(format));
  dateMap.set("wed", startOfWeek.add(1, "day").format(format));
  dateMap.set("thu", startOfWeek.add(1, "day").format(format));
  dateMap.set("fri", startOfWeek.add(1, "day").format(format));

  return dateMap;
}

function nextDate(date: string) {
  return moment(date, "YYYY-MM-DD").add(1, "day").format("YYYY-MM-DD");
}

export { mapDaysToDate, nextDate }
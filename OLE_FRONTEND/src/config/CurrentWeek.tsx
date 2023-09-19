import moment from "moment";

export const CURRENT_WEEK = moment().diff(moment("2023-08-07", "YYYY-MM-DD"), "weeks") + 1;
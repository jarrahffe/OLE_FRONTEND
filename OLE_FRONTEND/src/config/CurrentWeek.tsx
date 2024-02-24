import moment from "moment";

export const CURRENT_WEEK = moment().diff(moment("2024-02-19", "YYYY-MM-DD"), "weeks") + 1;
import moment from "moment";
export const START_SEMESTER = "2026-02-23";
export const SEMESTER = 1;

export const CURRENT_WEEK = moment().diff(moment(START_SEMESTER, "YYYY-MM-DD"), "weeks");
export const NUM_WEEKS_TOTAL = 16;
export const TEACHER_NAME = "Ole";
export let SESSION =  'Semester Break' || `Semester ${SEMESTER}` || 'Exam Period';


if (0 <= CURRENT_WEEK && CURRENT_WEEK < 14) {
    SESSION = `Semester ${SEMESTER}`;
} else if (0 < CURRENT_WEEK && CURRENT_WEEK < 16) {
    SESSION = 'Exam Period'
} else {
    SESSION = 'Semester Break'
};

console.log(SESSION);
console.log(CURRENT_WEEK);


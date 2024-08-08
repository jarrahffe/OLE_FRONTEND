import moment from "moment";
export const START_SEMESTER = "2024-07-22";
export const SEMESTER = 2;

export const CURRENT_WEEK = moment().diff(moment(START_SEMESTER, "YYYY-MM-DD"), "weeks");
export const NUM_WEEKS_TOTAL = 18;
export const TEACHER_NAME = "Ole";
export let SESSION =  'Semester Break' || `Semester ${SEMESTER}` || 'Exam Period';


if (0 <= CURRENT_WEEK && CURRENT_WEEK < 13) {
    SESSION = `Semester ${SEMESTER}`;
} else if (0 < CURRENT_WEEK && CURRENT_WEEK < 18) {
    SESSION = 'Exam Period'
} else {
    SESSION = 'Semester Break'
};

console.log(SESSION);
console.log(CURRENT_WEEK);


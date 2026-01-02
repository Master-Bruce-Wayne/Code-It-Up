import express from "express";
import { getContestSubmissions, getProblemSubmissionsByCode, getProblemSubmissionsById, getUserContestSubmissions, getUserProblemSubmissions, getUserSubmissions, runCode, submitSolution } from "../controllers/submissionController.js";

const router = express.Router();

// Run with custom input (DOES NOT save submission)
router.post("/run", runCode);

// Submit → judge testcases → save submission
router.post("/submit", submitSolution);

router.route("/user/:username").get(getUserSubmissions);
router.route("/problemById/:problemId").get(getProblemSubmissionsById);
router.route("/problemByCode/:problemCode").get(getProblemSubmissionsByCode)
router.route("/problem/:problemCode/user/:username").get(getUserProblemSubmissions)
router.route("/contest/:contestCode").get(getContestSubmissions)
router.route("/contest/:contestCode/user/:username").get(getUserContestSubmissions)
export default router;

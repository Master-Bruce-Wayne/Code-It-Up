import express from "express";
import { getProblemSubmissions, getUserSubmissions, runCode, submitSolution } from "../controllers/submissionController.js";

const router = express.Router();

// Run with custom input (DOES NOT save submission)
router.post("/run", runCode);

// Submit → judge testcases → save submission
router.post("/submit", submitSolution);

router.route("/user/:userId").get(getUserSubmissions);
router.route("/problem/:problemId").get(getProblemSubmissions);

export default router;

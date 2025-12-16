import express from "express"
import { createProblem, getAllProblems , getProblemByCode } from "../controllers/problemController.js";

const router=express.Router();

router.route("/createNew").post(createProblem);
router.route("/getAll").get( getAllProblems);
router.route("/getProb/:probCode").get(getProblemByCode);

export default router;
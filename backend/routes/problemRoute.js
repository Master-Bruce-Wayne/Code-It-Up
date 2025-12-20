import express from "express"
import { createProblem, getAllProblems , getProblemByCode, getProblemById } from "../controllers/problemController.js";

const router=express.Router();

router.route("/createNew").post(createProblem);
router.route("/getAll").get( getAllProblems);
router.route("/getProb/:probCode").get(getProblemByCode);
router.route("/getById/:id").get(getProblemById);

export default router;
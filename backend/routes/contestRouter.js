import express from "express"
import { createNewContest, getAllContests, getContestByCode } from "../controllers/contestController.js";


const router=express.Router();

router.route("/create-new").post(createNewContest);
router.route("/getAll").get( getAllContests);
router.route("/:contestCode").get(getContestByCode);

export default router;
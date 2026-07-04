import express from "express"
import { 
    createNewContest, 
    getAllContests, 
    getContestByCode,
    registerForContest,
    getRegistrationStatus
} from "../controllers/contestController.js";


const router=express.Router();

router.route("/create-new").post(createNewContest);
router.route("/getAll").get( getAllContests);
router.route("/:contestCode").get(getContestByCode);
router.route("/:contestCode/register").post(registerForContest);
router.route("/:contestCode/registration-status/:userId").get(getRegistrationStatus);

export default router;
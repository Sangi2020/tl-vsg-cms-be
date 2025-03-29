import express from "express";
import { getActiveTeam, getTeamById} from "../../controllers/team.controller.js";



const router = express.Router();

router.get('/active-team',getActiveTeam)
router.get("/get-team/:id",getTeamById);


export default router;
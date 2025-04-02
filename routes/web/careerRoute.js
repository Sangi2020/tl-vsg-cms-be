import express from "express";
import { getAllCareers } from "../../controllers/careercontroller.js";

const router = express.Router();

router.get("/get-all-career", getAllCareers);


export default router;
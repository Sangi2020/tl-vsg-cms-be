import express from "express";
import { getAllCasestudies,getcaseId } from "../../controllers/caseStudy.controller.js";

const router = express.Router();

router.get("/get-all-casestudy", getAllCasestudies);
router.get("/get-casestudy/:id", getcaseId);

export default router;
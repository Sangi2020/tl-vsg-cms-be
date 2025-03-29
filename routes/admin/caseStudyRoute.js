import express from "express";
import { createCaseStudy, getAllCasestudies, updateCasestudy, deleteCaseStudy } from "../../controllers/caseStudy.controller.js";
import upload from "../../middlewares/upload.middleware.js";
import verifyJwtToken from "../../middlewares/verifyJwtToken.js";

const router = express.Router();

router.post("/create-case-study",verifyJwtToken,upload.single("image"),createCaseStudy);
router.get("/get-all-casestudy",verifyJwtToken, getAllCasestudies);
router.put("/update-casestudy/:id",verifyJwtToken,upload.single('image'), updateCasestudy);
router.delete("/delete-casestudy/:id",verifyJwtToken,deleteCaseStudy );

export default router;
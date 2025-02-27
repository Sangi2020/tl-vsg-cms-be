import express from "express";
import { addCompanyDetails, getCompanyDetails } from "../../controllers/company.controller.js";
import upload from "../../middlewares/upload.middleware.js";


const router = express.Router();



router.post('/settings',upload.single("logo") ,addCompanyDetails)
router.get('/settings',getCompanyDetails)


export default router;
import express from "express";
import { getCompanyDetails } from "../../controllers/company.controller.js";


const router = express.Router();


router.get("/get-company-details", getCompanyDetails);


export default router; 
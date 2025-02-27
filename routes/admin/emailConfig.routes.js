import express from "express";
import {  getEmailConfiguration, sendTestEmail, upsertEmailConfig } from "../../controllers/emailConfig.controller.js";
import verifyJwtToken from "../../middlewares/verifyJwtToken.js";



const router = express.Router();

router.get('/email-config',verifyJwtToken,getEmailConfiguration)
router.put("/email-config/:id",verifyJwtToken, upsertEmailConfig);
router.post("/test-email",verifyJwtToken, sendTestEmail);






export default router;
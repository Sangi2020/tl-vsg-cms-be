import express from "express";
import {  storageUsage } from "../../controllers/settings.controller.js";

const router = express.Router();

router.get('/storage',storageUsage)

export default router;
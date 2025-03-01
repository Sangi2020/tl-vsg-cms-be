import express from "express";
import {getAllServices,getServiceById} from "../../controllers/service.controller.js";

const router = express.Router();

router.get("/get-all-service", getAllServices);
router.get("/get-service/:id", getServiceById);

export default router;
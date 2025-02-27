import express from "express";
import { createService, getAllServices, updateService, deleteService } from "../../controllers/service.controller.js";
import upload from "../../middlewares/upload.middleware.js";
import verifyJwtToken from "../../middlewares/verifyJwtToken.js";

const router = express.Router();

router.post("/create-service",verifyJwtToken,upload.single("image"),createService);
router.get("/get-all-service",verifyJwtToken, getAllServices);
router.put("/update-service/:id",verifyJwtToken,upload.single('image'), updateService);
router.delete("/delete-service/:id",verifyJwtToken, deleteService);

export default router;
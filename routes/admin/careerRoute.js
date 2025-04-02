import express from "express";
import { createCareer, getAllCareers, updateCareer, deleteCareer } from "../../controllers/careercontroller.js";
import verifyJwtToken from "../../middlewares/verifyJwtToken.js";

const router = express.Router();

router.post("/create-career",verifyJwtToken,createCareer);
router.get("/get-all-career",verifyJwtToken, getAllCareers);
router.put("/update-career/:id",verifyJwtToken,updateCareer);
router.delete("/delete-career/:id",verifyJwtToken,deleteCareer );

export default router;
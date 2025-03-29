import express from "express";
import {  getAllBlogs, getBlogById } from "../../controllers/blog.controller.js";


const router = express.Router();


router.get("/get-all-blogs", getAllBlogs);
router.get("/get-blog/:id", getBlogById);

export default router;
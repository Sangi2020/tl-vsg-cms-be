import express from 'express';
import { getSEOWithParams } from '../../controllers/seo.controller.js';


const router = express.Router();


router.get('/get-seo/:pageTitle', getSEOWithParams)


export default router;
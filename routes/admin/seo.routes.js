import express from 'express';
import { createSEO, deleteSEO, getSEO, updateSEO, upsertSEO } from '../../controllers/seo.controller.js';
import verifyJwtToken from '../../middlewares/verifyJwtToken.js';

const router = express.Router();

router.get('/get/:pageTitle',verifyJwtToken, getSEO);
router.post('/upsert/:pageTitle',verifyJwtToken, upsertSEO);

export default router;
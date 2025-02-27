import express from 'express';
import {
    createSocial,
    getAllSocials,
    getSocialById,
    updateSocial,
    deleteSocial
} from '../../controllers/social.controller.js';
import verifyJwtToken from '../../middlewares/verifyJwtToken.js';

const router = express.Router();

// Admin routes
router.post('/create-social', createSocial); // Create a new social media entry
router.get('/get-social',verifyJwtToken, getAllSocials); // Get all social media entries
router.get('/get-social/:id', verifyJwtToken,getSocialById); // Get a single social media entry by ID
router.put('/update-social/:id',verifyJwtToken, updateSocial); // Update a social media entry
router.delete('/delete-social/:id', deleteSocial); // Delete a social media entry

export default router;
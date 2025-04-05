import express from 'express';

import {
    getAllYoutubeVideo,
} from '../../controllers/youtubeVideo.controller.js';

const router = express.Router();


router.get('/get-all-youtube-videos', getAllYoutubeVideo);


export default router;
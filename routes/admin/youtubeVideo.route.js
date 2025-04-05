import express from 'express';
import verifyJwtToken from '../../middlewares/verifyJwtToken.js';
import { 
addYoutubeVideo, 
deleteYoutubeVideo, 
getAllYoutubeVideo, 
ReOrderYoutubeVideo, 
updateYoutubeVideo 
} from '../../controllers/youtubeVideo.controller.js';

const router = express.Router();

router.post('/create-videos',verifyJwtToken, addYoutubeVideo);
router.get('/get-all-youtube-videos',verifyJwtToken, getAllYoutubeVideo);
router.delete('/delete-youtube-video/:id',verifyJwtToken, deleteYoutubeVideo);
router.put('/youtube-videos/reorder',verifyJwtToken, ReOrderYoutubeVideo);
router.put('/youtube-video/:id',verifyJwtToken, updateYoutubeVideo);

export default router;
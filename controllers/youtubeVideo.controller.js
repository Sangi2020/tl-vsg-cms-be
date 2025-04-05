import prisma from "../helpers/prisma.js";
import axios from "axios";
import { extractVideoId } from "../utils/extractYoutubeVideoId.js";


export const addYoutubeVideo = async (req, res) => {
    try {
        const { youtubeUrl } = req.body;
        console.log(youtubeUrl, "urll");
        // Validate input
        if (!youtubeUrl) {
            return res.status(400).json({ error: 'YouTube URL is required' });
        }

        // Extract video ID
        const videoId = extractVideoId(youtubeUrl);
        if (!videoId) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        // Check if video with the same ID already exists
        const normalizedUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const existingVideo = await prisma.youTubeVideo.findFirst({
            where: {
                youtubeUrl: normalizedUrl
            }
        });

        // If video already exists, return error
        if (existingVideo) {
            return res.status(409).json({
                error: 'This YouTube video is already in your collection',
                existingVideo
            });
        }

        // Fetch video metadata from YouTube API
        const API_KEY = process.env.YOUTUBE_API_KEY;
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
            params: {
                part: 'snippet,contentDetails,statistics',
                id: videoId,
                key: API_KEY
            }
        });

        if (!response.data.items || response.data.items.length === 0) {
            return res.status(404).json({ error: 'YouTube video not found' });
        }

        const videoData = response.data.items[0];
        const snippet = videoData.snippet;
        const statistics = videoData.statistics;
        const contentDetails = videoData.contentDetails;

        // Parse duration from ISO 8601 format
        const isoDuration = contentDetails.duration;
        const durationRegex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
        const durationMatch = isoDuration.match(durationRegex);

        const hours = durationMatch[1] ? `${durationMatch[1]}:` : '';
        const minutes = durationMatch[2] ? durationMatch[2].padStart(2, '0') : '00';
        const seconds = durationMatch[3] ? durationMatch[3].padStart(2, '0') : '00';
        const formattedDuration = `${hours}${minutes}:${seconds}`;

        // Get highest resolution thumbnail
        let thumbnailUrl = '';
        const thumbnails = snippet.thumbnails;
        if (thumbnails.maxres) {
            thumbnailUrl = thumbnails.maxres.url;
        } else if (thumbnails.high) {
            thumbnailUrl = thumbnails.high.url;
        } else if (thumbnails.medium) {
            thumbnailUrl = thumbnails.medium.url;
        } else {
            thumbnailUrl = thumbnails.default.url;
        }

        // Create new video record in database
        const newVideo = await prisma.youTubeVideo.create({
            data: {
                title: snippet.title,
                description: snippet.description,
                youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
                thumbnailUrl: thumbnailUrl,
                views: parseInt(statistics.viewCount, 10) || 0,
                duration: formattedDuration,
                publishedAt: new Date(snippet.publishedAt),
                order: (await prisma.youTubeVideo.count()) + 1
            }
        });

        res.status(201).json(newVideo);

    } catch (error) {
        console.error('Error adding YouTube video:', error);
        res.status(500).json({ error: 'Failed to add YouTube video' });
    }

}


export const getAllYoutubeVideo = async (req, res) => {
    try {
        const videos = await prisma.youTubeVideo.findMany({
            orderBy: {
                order: 'asc'
            }
        });
        res.status(200).json(videos);
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        res.status(500).json({ error: 'Failed to fetch YouTube videos' });
    }
}


export const getAllYoutubeVideoCMS = async (req, res) => {
    try {
        const videos = await prisma.youTubeVideo.findMany({
            orderBy: {
                order: 'asc'
            }
        });
        res.status(200).json(videos);
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        res.status(500).json({ error: 'Failed to fetch YouTube videos' });
    }
}


export const deleteYoutubeVideo = async (req, res) => {
    const { id } = req.params;
    try {
        // First get the video to be deleted to know its order
        const videoToDelete = await prisma.youTubeVideo.findUnique({
            where: { id: id }
        });
        
        if (!videoToDelete) {
            return res.status(404).json({ error: 'Video not found' });
        }
        
        // Start a transaction to ensure all operations complete or none do
        await prisma.$transaction(async (prisma) => {
            // Delete the video
            await prisma.youTubeVideo.delete({
                where: { id: id }
            });
            
            // Decrement the order of all videos that came after the deleted one
            await prisma.youTubeVideo.updateMany({
                where: {
                    order: { gt: videoToDelete.order }
                },
                data: {
                    order: { decrement: 1 }
                }
            });
        });
        
        res.status(200).json({ success: true, message: 'Video deleted and orders updated' });
    } catch (error) {
        console.error('Error deleting YouTube video:', error);
        res.status(500).json({ error: 'Failed to delete video' });
    }
}


export const ReOrderYoutubeVideo = async (req, res) => {
    const { videoIds } = req.body;

    if (!Array.isArray(videoIds)) {
        return res.status(400).json({ error: 'Invalid input format' });
    }

    try {
        // Update each video's order in a transaction
        await prisma.$transaction(
            videoIds.map((id, index) =>
                prisma.youTubeVideo.update({
                    where: { id },
                    data: { order: index + 1 }
                })
            )
        );

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error reordering videos:', error);
        res.status(500).json({ error: 'Failed to reorder videos' });
    }
}


export const updateYoutubeVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const { youtubeUrl, newOrder } = req.body;

        // Validate input
        if (!youtubeUrl) {
            return res.status(400).json({ error: 'YouTube URL is required' });
        }

        // Extract video ID
        const videoId = extractVideoId(youtubeUrl);
        if (!videoId) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        // Get current video
        const currentVideo = await prisma.youTubeVideo.findUnique({
            where: { id }
        });

        if (!currentVideo) {
            return res.status(404).json({ error: 'Video not found' });
        }

        // Check if the URL is changing and if it already exists
        if (currentVideo.youtubeUrl !== `https://www.youtube.com/watch?v=${videoId}`) {
            const normalizedUrl = `https://www.youtube.com/watch?v=${videoId}`;
            const existingVideo = await prisma.youTubeVideo.findFirst({
                where: {
                    youtubeUrl: normalizedUrl,
                    id: { not: id }  // Exclude the current video
                }
            });

            // If video already exists, return error
            if (existingVideo) {
                return res.status(409).json({
                    error: 'This YouTube video is already in your collection',
                    existingVideo
                });
            }
        }

        // Fetch video metadata from YouTube API
        const API_KEY = process.env.YOUTUBE_API_KEY;
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
            params: {
                part: 'snippet,contentDetails,statistics',
                id: videoId,
                key: API_KEY
            }
        });

        if (!response.data.items || response.data.items.length === 0) {
            return res.status(404).json({ error: 'YouTube video not found' });
        }

        const videoData = response.data.items[0];
        const snippet = videoData.snippet;
        const statistics = videoData.statistics;
        const contentDetails = videoData.contentDetails;

        // Parse duration from ISO 8601 format
        const isoDuration = contentDetails.duration;
        const durationRegex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
        const durationMatch = isoDuration.match(durationRegex);

        const hours = durationMatch[1] ? `${durationMatch[1]}:` : '';
        const minutes = durationMatch[2] ? durationMatch[2].padStart(2, '0') : '00';
        const seconds = durationMatch[3] ? durationMatch[3].padStart(2, '0') : '00';
        const formattedDuration = `${hours}${minutes}:${seconds}`;

        // Get highest resolution thumbnail
        let thumbnailUrl = '';
        const thumbnails = snippet.thumbnails;
        if (thumbnails.maxres) {
            thumbnailUrl = thumbnails.maxres.url;
        } else if (thumbnails.high) {
            thumbnailUrl = thumbnails.high.url;
        } else if (thumbnails.medium) {
            thumbnailUrl = thumbnails.medium.url;
        } else {
            thumbnailUrl = thumbnails.default.url;
        }

        // Start a transaction for updating the video and potentially reordering
        await prisma.$transaction(async (prisma) => {
            // Update video record in database
            const updatedVideo = await prisma.youTubeVideo.update({
                where: { id },
                data: {
                    title: snippet.title,
                    description: snippet.description,
                    youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
                    thumbnailUrl: thumbnailUrl,
                    views: parseInt(statistics.viewCount, 10) || 0,
                    duration: formattedDuration,
                    publishedAt: new Date(snippet.publishedAt)
                }
            });
        });

        const updatedVideo = await prisma.youTubeVideo.findUnique({
            where: { id }
        });

        res.json(updatedVideo);

    } catch (error) {
        console.error('Error updating YouTube video URL:', error);

        // Check if error is related to record not found
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Video not found' });
        }

        res.status(500).json({ error: 'Failed to update YouTube video URL' });
    }
}

export const updateVideoOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { newOrder } = req.body;
        
        if (isNaN(newOrder) || newOrder < 1) {
            return res.status(400).json({ error: 'Invalid order value' });
        }
        
        // Get the current video
        const currentVideo = await prisma.youTubeVideo.findUnique({
            where: { id }
        });
        
        if (!currentVideo) {
            return res.status(404).json({ error: 'Video not found' });
        }
        
        const currentOrder = currentVideo.order;
        
        // Get total count to validate order
        const totalVideos = await prisma.youTubeVideo.count();
        
        if (newOrder > totalVideos) {
            return res.status(400).json({ error: `Order cannot be greater than total videos (${totalVideos})` });
        }
        
        // Start a transaction
        await prisma.$transaction(async (prisma) => {
            if (newOrder > currentOrder) {
                // Moving down: decrement videos between current and new position
                await prisma.youTubeVideo.updateMany({
                    where: {
                        order: { 
                            gt: currentOrder,
                            lte: newOrder 
                        }
                    },
                    data: {
                        order: { decrement: 1 }
                    }
                });
            } else if (newOrder < currentOrder) {
                // Moving up: increment videos between new and current position
                await prisma.youTubeVideo.updateMany({
                    where: {
                        order: { 
                            gte: newOrder,
                            lt: currentOrder 
                        }
                    },
                    data: {
                        order: { increment: 1 }
                    }
                });
            }
            
            // Update the target video's order
            await prisma.youTubeVideo.update({
                where: { id },
                data: { order: newOrder }
            });
        });
        
        // Get updated videos to return in response
        const updatedVideos = await prisma.youTubeVideo.findMany({
            orderBy: { order: 'asc' }
        });
        
        res.status(200).json({
            success: true,
            message: 'Video order updated successfully',
            videos: updatedVideos
        });
        
    } catch (error) {
        console.error('Error updating video order:', error);
        res.status(500).json({ error: 'Failed to update video order' });
    }
}
const { Worker } = require('bullmq');
const videoService = require('../services/video.service');
const storageService = require('../services/storage.service');
const Story = require('../models/story.model');
const User = require('../models/user.model');
const { connection } = require('../queues/video.queue');
const path = require('path');

/**
 * Worker: The backbone of StoryWala High-Fidelity Rendering. 
 * This processes heavy 4K/1080p video synthesis asynchronously to prevent API timeout.
 */
const videoWorker = new Worker('video-export', async (job) => {
    const { storyId, userId, quality, platform, hasWatermark } = job.data;
    
    try {
        console.log(`[JOB ${job.id}] Rendering ${quality} for Story ${storyId}...`);
        
        const story = await Story.findById(storyId);
        if (!story) throw new Error('Story data lost.');

        // Update Job Status
        await job.updateProgress(10);
        
        // 1. Synthesize High-Quality MP4
        const finalFile = await videoService.mergeScenes(story.scenes, story._id, {
            quality: quality,
            platform: platform,
            isPreview: false,
            hasWatermark: hasWatermark
        });

        await job.updateProgress(70);

        // 2. Synchronize to Cloud Storage (AWS S3)
        const localPath = path.join(process.cwd(), 'src/uploads', finalFile);
        const s3Key = await storageService.uploadToCloud(localPath, finalFile);

        await job.updateProgress(95);

        // 3. Finalize Database State
        story.videoUrl = s3Key;
        story.status = 'completed';
        await story.save();

        // 4. Increment Success Usage (Final step)
        await User.findByIdAndUpdate(userId, { $inc: { videosGenerated: 1 } });

        console.log(`[JOB ${job.id}] Finalized Master exported: ${s3Key}`);
        
        return { videoUrl: story.videoUrl, success: true };

    } catch (error) {
        console.error(`[JOB ${job.id}] FAILED:`, error.message);
        await Story.findByIdAndUpdate(storyId, { status: 'failed' });
        throw error;
    }
}, { connection });

videoWorker.on('completed', job => {
    console.log(`[SUCCESS] Rendering complete for JOB ${job.id}`);
});

videoWorker.on('failed', (job, err) => {
    console.error(`[ERROR] Rendering error for JOB ${job.id}:`, err.message);
});

module.exports = videoWorker;

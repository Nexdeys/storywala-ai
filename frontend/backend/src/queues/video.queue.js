const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
    maxRetriesPerRequest: null,
});

// 1. Create the Final Export Queue
const videoQueue = new Queue('video-export', { connection });

/**
 * Adds a video generation job to the high-performance background queue.
 */
exports.addJob = async (data) => {
    return await videoQueue.add('render-hq', data, {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 10000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    });
};

module.exports.videoQueue = videoQueue;
module.exports.connection = connection;

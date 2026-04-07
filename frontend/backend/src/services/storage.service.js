const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const fs = require('fs');
const path = require('path');

const s3 = new S3Client({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

/**
 * High-Speed Cloud Storage Orchestrator. 
 * Handles uploads to AWS S3 and provides time-limited Secure Presigned URLs.
 */
exports.uploadToCloud = async (localPath, fileName) => {
    try {
        const fileStream = fs.createReadStream(localPath);
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `videos/${fileName}`,
            Body: fileStream,
            ContentType: 'video/mp4'
        });

        await s3.send(command);
        
        // Cleanup local file after successful upload
        if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
        
        return `videos/${fileName}`; // Return S3 Key
    } catch (error) {
        console.error('S3 Upload Error:', error);
        throw new Error('Cloud storage synchronization failed.');
    }
};

/**
 * Generates a Secure, Presigned 1-hour URL for the frontend.
 */
exports.getSecureUrl = async (key) => {
    try {
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key
        });
        // URL expires in 1 hour
        return await getSignedUrl(s3, command, { expiresIn: 3600 });
    } catch (err) {
        return null; // Fallback to original local path or broken link
    }
};

/**
 * Cleanup logic for old files. 
 */
exports.deleteFromCloud = async (key) => {
    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key
        });
        await s3.send(command);
    } catch (err) {
        console.error('S3 Deletion Error:', err);
    }
};

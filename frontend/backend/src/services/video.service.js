const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffprobeInstaller = require('@ffprobe-installer/ffprobe');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

const RESOLUTIONS = {
    '480p': { w: 480, h: 854 },
    '720p': { w: 720, h: 1280 },
    '1080p': { w: 1080, h: 1920 },
    '4K': { w: 2160, h: 3840 },
    '16:9_1080p': { w: 1920, h: 1080 } // For YouTube 16:9
};

/**
 * High-performance Video synthesis engine with Multi-Resolution & Platform support.
 */
exports.mergeScenes = async (scenes, storyId, options = {}) => {
    return new Promise(async (resolve, reject) => {
        const { 
            quality = '480p', 
            platform = 'Shorts', 
            hasWatermark = true,
            isPreview = false
        } = options;

        const uploadDir = path.join(process.cwd(), 'src/uploads');
        // If it's a preview, we use a different name to avoid overwriting or to keep both
        const outputSuffix = isPreview ? '_preview' : `_final_${quality}`;
        const finalOutputName = `video_${storyId}${outputSuffix}.mp4`;
        const finalOutputPath = path.join(uploadDir, finalOutputName);
        const musicPath = path.join(process.cwd(), 'src/resources/music/bg_track.mp3');

        try {
            const clipPaths = [];
            const res = platform === 'YouTube' ? RESOLUTIONS['16:9_1080p'] : RESOLUTIONS[quality] || RESOLUTIONS['480p'];

            for (let i = 0; i < scenes.length; i++) {
                const clipName = `clip_${storyId}_${i}_${quality}_${platform}.mp4`;
                const clipPath = path.join(uploadDir, clipName);
                
                await createSceneClip({
                    imagePath: path.join(uploadDir, scenes[i].imageFileName),
                    audioPath: path.join(uploadDir, scenes[i].voiceFileName),
                    text: scenes[i].text,
                    outputPath: clipPath,
                    resolution: res,
                    hasWatermark: hasWatermark,
                    isPreview: isPreview
                });
                clipPaths.push(clipPath);
            }

            const concatListPath = path.join(uploadDir, `list_${storyId}_${quality}.txt`);
            const listContent = clipPaths.map(p => `file '${p.replace(/'/g, "'\\''")}'`).join('\n');
            fs.writeFileSync(concatListPath, listContent);

            const tempMergedPath = path.join(uploadDir, `temp_${storyId}_${quality}.mp4`);

            // Use fast preset for previews, medium for finals
            const preset = isPreview ? 'ultrafast' : 'medium';
            const crf = isPreview ? '28' : '20'; // Lower quality (higher CRF) for previews

            ffmpeg()
                .input(concatListPath)
                .inputOptions(['-f concat', '-safe 0'])
                .on('error', (err) => reject(new Error(`Merging Error: ${err.message}`)))
                .on('end', async () => {
                    await overlayMusic(tempMergedPath, musicPath, finalOutputPath, isPreview ? 0.05 : 0.15);
                    
                    // Cleanup
                    clipPaths.forEach(p => { if (fs.existsSync(p)) fs.unlinkSync(p); });
                    if (fs.existsSync(concatListPath)) fs.unlinkSync(concatListPath);
                    if (fs.existsSync(tempMergedPath)) fs.unlinkSync(tempMergedPath);
                    
                    resolve(finalOutputName);
                })
                .outputOptions([
                    `-preset ${preset}`,
                    `-crf ${crf}`,
                    '-pix_fmt yuv420p'
                ])
                .save(tempMergedPath);

        } catch (err) {
            reject(err);
        }
    });
};

const createSceneClip = ({ imagePath, audioPath, text, outputPath, resolution, hasWatermark, isPreview }) => {
    return new Promise((resolve, reject) => {
        const fontSize = Math.floor(resolution.w / 20); // Scale subtitle size with resolution
        const watermarkText = hasWatermark ? 'STORYWALA AI - FREE TIER' : '';
        
        let vf = `scale=${resolution.w}:${resolution.h}:force_original_aspect_ratio=increase,crop=${resolution.w}:${resolution.h}`;
        
        // Add Subtitles
        vf += `,drawtext=text='${text.replace(/'/g, "\\'")}':fontcolor=white:fontsize=${fontSize}:box=1:boxcolor=black@0.6:boxborderw=20:x=(w-text_w)/2:y=h-${Math.floor(resolution.h*0.15)}:fontfile='C\\:/Windows/Fonts/arial.ttf'`;
        
        // Add Watermark if applicable
        if (hasWatermark) {
            vf += `,drawtext=text='${watermarkText}':fontcolor=white@0.3:fontsize=${Math.floor(fontSize*0.5)}:x=w-text_w-20:y=20:fontfile='C\\:/Windows/Fonts/arial.ttf'`;
        }
        
        // Add "PREVIEW" label if it's a preview
        if (isPreview) {
            vf += `,drawtext=text='PREVIEW ONLY':fontcolor=red@0.5:fontsize=${fontSize}:x=(w-text_w)/2:y=(h-text_h)/2:fontfile='C\\:/Windows/Fonts/arial.ttf'`;
        }

        ffmpeg()
            .input(imagePath)
            .loop()
            .input(audioPath)
            .audioCodec('aac')
            .videoCodec('libx264')
            .outputOptions([
                '-tune stillimage',
                '-shortest',
                '-vf', vf,
                '-t 60' // Max 60s safety
            ])
            .on('error', (err) => reject(err))
            .on('end', () => resolve(outputPath))
            .save(outputPath);
    });
};

const overlayMusic = (videoPath, musicPath, outputPath, volume) => {
    return new Promise((resolve, reject) => {
        const bgExists = fs.existsSync(musicPath);
        let command = ffmpeg().input(videoPath);
        if (bgExists) {
            command = command.input(musicPath)
                .complexFilter([
                    `[1:a]volume=${volume}[bg]`,
                    '[0:a][bg]amix=inputs=2:duration=first[a]'
                ])
                .map('0:v')
                .map('[a]');
        }
        command
            .on('error', (err) => reject(err))
            .on('end', () => resolve(outputPath))
            .save(outputPath);
    });
};

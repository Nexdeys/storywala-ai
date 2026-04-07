const axios = require('axios');
const fs = require('fs');
const path = require('path');

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// ElevenLabs Voice IDs for Premium Human-like narration
const VOICES = {
    MALE: {
        ENG: 'pNInz6obpgmqMtmFq5tH', // Adam
        HIN: 'N2lVS1wzUOT9V7G2Xpxs', // Custom Hindi Male (e.g. Liam)
    },
    FEMALE: {
        ENG: '21m00Tcm4TlvDq8ikWAM', // Rachel
        HIN: 'ThT5KcBeYPX3keUQqHPh', // Custom Hindi Female (e.g. Dorothy)
    }
};

/**
 * Generates high-fidelity human-like voice using ElevenLabs.
 * Supports gender, tone, and emotion level control.
 */
exports.generateVoice = async (text, sceneId, options = {}) => {
    try {
        const { 
            gender = 'FEMALE', 
            language = 'ENG', 
            tone = 'neutral', 
            emotionLevel = 'medium' 
        } = options;

        const voiceId = VOICES[gender.toUpperCase()]?.[language.toUpperCase()] || VOICES.FEMALE.ENG;
        
        // Map emotion/tone to ElevenLabs stability/similarity settings
        // Stability: lower = more expressive/variable, higher = more stable
        // Similarity: higher = closer to original voice
        let stability = 0.5;
        let similarity = 0.75;
        let style = 0.0;

        if (emotionLevel === 'high') stability = 0.35; // More expressive
        if (emotionLevel === 'low') stability = 0.7; // More robotic/monotone

        // Tone exaggeration
        if (tone === 'dramatic') style = 0.5;
        if (tone === 'funny') { stability = 0.4; similarity = 0.8; }

        const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
        const response = await axios({
            method: 'post',
            url: url,
            data: {
                text: text,
                model_id: language.toUpperCase() === 'HIN' ? 'eleven_multilingual_v2' : 'eleven_monolingual_v1',
                voice_settings: {
                    stability: stability,
                    similarity_boost: similarity,
                    style: style,
                    use_speaker_boost: true
                }
            },
            headers: {
                'xi-api-key': ELEVENLABS_API_KEY,
                'Content-Type': 'application/json'
            },
            responseType: 'stream'
        });

        const fileName = `voice_${sceneId}.mp3`;
        const filePath = path.join(process.cwd(), 'src/uploads', fileName);
        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(fileName));
            writer.on('error', (err) => reject(new Error(`Voice Stream Error: ${err.message}`)));
        });
    } catch (error) {
        console.error('ElevenLabs API Error:', error.response?.data || error.message);
        throw new Error('Failed to generate high-fidelity voice. Check your API key and balance.');
    }
};

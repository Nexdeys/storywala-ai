const OpenAI = require('openai');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates a cost-optimized short-form script.
 * Rules: Under 120 words, viral hooks, simple language.
 */
exports.generateStory = async (prompt, tone = 'viral', language = 'English', length = 'short') => {
    const wordCount = length === 'short' ? 50 : length === 'medium' ? 100 : 120;
    
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o', 
            messages: [
                {
                    role: 'system',
                    content: `You are a short-form content script generator.
                    Rules:
                    - Keep output under ${wordCount} words (EXTREMELY IMPORTANT)
                    - Make it highly engaging and viral
                    - Use simple language
                    - Add emotional hooks
                    - Avoid long descriptions
                    - No unnecessary details
                    
                    Tone: ${tone}
                    Language: ${language}
                    
                    Return a JSON object with:
                    - "title": Catchy title
                    - "script": The primary narrative text
                    - "hooks": Array of 3 viral opening lines
                    - "wordCount": Total words generated`
                },
                {
                    role: 'user',
                    content: `Generate a ${length} script based on: ${prompt}`
                }
            ],
            response_format: { type: 'json_object' }
        });

        const storyData = JSON.parse(response.choices[0].message.content);
        return storyData;
    } catch (error) {
        console.error('Error in OpenAI Story Generation:', error);
        throw new Error('Failed to generate cost-optimized script');
    }
};

exports.generateImagePrompt = async (sceneText, storyContext) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: 'Generate a highly detailed DALL-E 3 image prompt for a cinematic scene. Style: Hyper-realistic, dramatic lighting, 8k, cinematic composition.'
                },
                {
                    role: 'user',
                    content: `Scene Description: ${sceneText}. Overall Story Context: ${storyContext}`
                }
            ]
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error generating image prompt:', error);
        throw new Error('Failed to generate image prompt');
    }
};

exports.generateImage = async (imagePrompt, sceneId) => {
    try {
        const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt: imagePrompt,
            n: 1,
            size: '1024x1024'
        });

        const imageUrl = response.data[0].url;
        const fileName = `image_${sceneId}.png`;
        const uploadPath = path.join(process.cwd(), 'src/uploads');
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
        
        const filePath = path.join(uploadPath, fileName);

        const imageRes = await axios({
            url: imageUrl,
            method: 'GET',
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(filePath);
        imageRes.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(fileName));
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('Error in DALL-E Image Generation:', error);
        throw new Error('Failed to generate cinematic image');
    }
};

/**
 * Generates 5 Viral Opening Hooks for a specific story prompt.
 * Optimized for Instagram/TikTok retention.
 */
exports.generateViralHooks = async (prompt) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: 'You are a viral copywriting genius. Suggest 5 high-impact 3-second opening "HOOKS" for a short video based on the prompt. Return as a JSON array of strings.'
                },
                {
                    role: 'user',
                    content: `Story Topic: ${prompt}`
                }
            ],
            response_format: { type: 'json_object' }
        });

        const data = JSON.parse(response.choices[0].message.content);
        return data.hooks || [];
    } catch (error) {
        return ['Once upon a time...', 'You wont believe this...', 'Listen closely...', 'Everything changed when...', 'The truth is...'];
    }
};

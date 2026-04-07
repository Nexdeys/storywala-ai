const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
exports.generateStory = async (p, t, l, len) => {
          const m = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const r = await m.generateContent(`Tone: ${t}, Lang: ${l}. Return JSON: {title, script, hooks}. Prompt: ${p}`);
          return JSON.parse(r.response.text().replace(/```json|```/g, ''));
};
exports.generateImagePrompt = async (t) => {
          const m = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const r = await m.generateContent(`Image prompt for: ${t}`);
          return r.response.text();
};

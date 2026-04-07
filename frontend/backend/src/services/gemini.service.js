const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateStory = async (prompt, tone = 'viral', language = 'English', length = 'short') => {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const wordCount = length === 'short' ? 50 : 120;
      const system = "Rules: Under " + wordCount + " words, Viral tone: " + tone + ", Lang: " + language + ". Return JSON: {title, script, hooks}";
      try {
                const result = await model.generateContent(system + "\n\nPrompt: " + prompt);
                const response = await result.response;
                return JSON.parse(response.text().replace(/```json|```/g, ''));
      } catch (e) { throw new Error('Gemini Fail'); }
};

exports.generateImagePrompt = async (text) => {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const res = await model.generateContent("Create a cinematic image prompt for: " + text);
      return res.response.text();
};

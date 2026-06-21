const { GoogleGenAI, Type } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Define a strict schema for the outline so Gemini cannot return invalid JSON strings
const outlineSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING }
        },
        required: ["title", "description"]
    }
};

// @desc    Generate a book outline
// @route   POST /api/ai/generate-outline
// @access  Private
const generateOutline = async (req, res) => {
    // 1. Guardrail against missing/malformed req.body
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Invalid or missing JSON payload" });
    }

    try {
        const { topic, style, numChapters, description } = req.body;

        if (!topic) {
            return res.status(400).json({ message: "Please provide a topic" });
        }

        const prompt = `You are an expert book outline generator. Create a comprehensive book outline based on the following requirements:

Topic: "${topic}"
${description ? `Description: ${description}` : ""}
Writing Style: ${style}
Number of Chapters: ${numChapters || 5}

Requirements:
1. Generate exactly ${numChapters || 5} chapters.
2. Each chapter title should be clear, engaging, and follow a logical progression.
3. Each chapter description should be 2-3 sentences explaining what the chapter covers.
4. Ensure chapters build upon each other coherently.`;

        // Using standard gemini-2.5-flash to avoid the lite-tier 503 rate limits
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                // Forces the model to strictly follow the JSON schema structure
                responseMimeType: "application/json",
                responseSchema: outlineSchema
            }
        });

        // The response is now guaranteed to be parseable JSON matching our outlineSchema
        const outline = JSON.parse(response.text);
        res.status(200).json({ outline });

    } catch (error) {
        console.error("Error generating outline:", error);
        res.status(500).json({
            message: "Server error during AI outline generation",
            error: error.message
        });
    }
};

// @desc    Generate chapter content
// @route   POST /api/ai/generate-chapter-content
// @access  Private
const generateChapterContent = async (req, res) => {
    // 1. Guardrail against missing/malformed req.body
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Invalid or missing JSON payload" });
    }

    try {
        const { chapterTitle, chapterDescription, style } = req.body;

        if (!chapterTitle) {
            return res.status(400).json({ message: "Please provide a chapter title" });
        }

        const prompt = `You are an expert writer specializing in ${style} content. Write a complete chapter for a book with the following specifications:

Chapter Title: "${chapterTitle}"
${chapterDescription ? `Chapter Description: ${chapterDescription}` : ''}
Writing Style: ${style}
Target Length: Comprehensive and detailed (aim for 1500-2500 words)

Requirements:
1. Write in a ${style ? style.toLowerCase() : 'informative'} tone throughout the chapter.
2. Structure the content with clear sections and smooth transitions.
3. Include relevant examples, explanations, or anecdotes as appropriate.
4. Ensure the content flows logically from introduction to conclusion.
${chapterDescription ? `5. Cover all points mentioned in the chapter description.` : ''}

Format Guidelines:
- Start with a compelling opening paragraph.
- Use clear paragraph breaks for readability.
- Write in plain text without markdown formatting.`;

        // Switch to standard gemini-2.5-flash here too
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const content = response.text;
        res.status(200).json({ content });

    } catch (err) {
        console.error("Error generating chapter:", err);
        res.status(500).json({
            message: "Server error during AI chapter generation",
            error: err.message
        });
    }
};

module.exports = {
    generateOutline,
    generateChapterContent,
};
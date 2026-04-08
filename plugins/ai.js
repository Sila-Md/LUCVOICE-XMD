const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "ai",
    desc: "Chat with AI (OpenAI)",
    category: "main",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, reply, args, pushname }) => {
    try {
        if (!args || args.length === 0) return reply("❌ Please provide a question or message. Example: .ai Hello!");

        const userMessage = args.join(" ");

        // OpenAI API key from environment
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) return reply("❌ OpenAI API key is not set. Please set OPENAI_API_KEY in environment.");

        // Call OpenAI API (GPT-3.5)
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userMessage }],
                max_tokens: 500,
                temperature: 0.7
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                }
            }
        );

        const aiReply = response.data.choices[0].message.content.trim();

        // Send AI reply
        await reply(`🤖 *AI Response:*\n${aiReply}`);

    } catch (error) {
        console.error(error);
        reply("❌ Error communicating with AI!");
    }
});

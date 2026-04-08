const { cmd } = require('../command');
const OpenAI = require('openai');

// Replace with your OpenAI API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Simple memory for multi-turn conversations
const gptMemory = {};

cmd({
    pattern: "gpt",
    desc: "Chat with AI (OpenAI GPT)",
    category: "main",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, reply, pushname, args }) => {
    try {
        if (!args || args.length === 0) 
            return reply("❌ Please type a message to chat. Example: .gpt Hello!");

        const userMessage = args.join(" ");

        // Initialize memory for user if not exists
        if (!gptMemory[from]) gptMemory[from] = [];

        // Add user message to memory
        gptMemory[from].push({ role: "user", content: userMessage });

        // Request OpenAI GPT response
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: gptMemory[from],
            temperature: 0.7
        });

        const botReply = response.choices[0].message.content;

        // Save bot reply to memory
        gptMemory[from].push({ role: "assistant", content: botReply });

        // Send AI reply
        await conn.sendMessage(from, { text: botReply }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply("❌ Error in GPT command!");
    }
});

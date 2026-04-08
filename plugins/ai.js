const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "ai",
    desc: "Chat with AI (No API Key)",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
    try {
        if (!args[0]) {
            return reply("🤖 Tafadhali andika swali.\nMfano: .ai Habari yako?");
        }

        const text = args.join(" ");

        // Free AI API (no key)
        const res = await axios.get("https://api.simsimi.vn/v2/simtalk", {
            params: {
                text: text,
                lc: "sw" // Kiswahili
            }
        });

        let ai = res.data.message;

        // Optional style boost 😎
        let final = `🤖 *AI RESPONSE*\n\n${ai}`;

        reply(final);

    } catch (err) {
        console.log(err);

        // fallback ikiwa API imefail
        reply("❌ AI haijapatikana kwa sasa, jaribu tena baadae.");
    }
});

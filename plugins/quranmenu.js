const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "quranmenu",
    desc: "Interactive Quran menu with buttons, audio, and tafsir",
    category: "religion",
    react: "📖",
    filename: __filename
},
async (conn, mek, m, { from }) => {
    try {
        // Menu text
        const menuText = `
🕌 *Quran Menu - LUCVOICE-XMD*

Choose an option by clicking the buttons below:

1️⃣ Random Ayah (Arabic + Translation + Audio)
2️⃣ Surah Info / First Ayah
3️⃣ Tafsir of specific Ayah
4️⃣ Audio Recitation
`;

        // WhatsApp interactive buttons
        const buttons = [
            { buttonId: ".quran", buttonText: { displayText: "Random Ayah" }, type: 1 },
            { buttonId: ".quranmenu-surah", buttonText: { displayText: "Surah Info" }, type: 1 },
            { buttonId: ".tafsi", buttonText: { displayText: "Tafsir" }, type: 1 },
            { buttonId: ".recite", buttonText: { displayText: "Audio Recitation" }, type: 1 }
        ];

        const buttonMessage = {
            text: menuText,
            footer: "Powered by LUCVOICE-XMD",
            buttons: buttons,
            headerType: 1
        };

        await conn.sendMessage(from, buttonMessage);

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { text: "❌ Error displaying interactive Quran menu!" }, { quoted: m });
    }
});

// Optional: Handle button commands
cmd({
    pattern: "quranmenu-surah",
    desc: "Fetch Surah info and first ayah",
    category: "religion",
    filename: __filename
},
async (conn, mek, m, { reply }) => {
    await reply("Example: .quran 1 or .quran Al-Fatiha to get Surah info and first Ayah.");
});

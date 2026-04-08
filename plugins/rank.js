const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

// File to store XP data
const xpFile = path.join(__dirname, 'userXP.json');
let userXP = {};

// Load existing XP data
if (fs.existsSync(xpFile)) {
    userXP = JSON.parse(fs.readFileSync(xpFile));
}

// Save XP data
function saveXP() {
    fs.writeFileSync(xpFile, JSON.stringify(userXP, null, 2));
}

// Generate visual XP bar
function generateXPBar(current, max) {
    const totalBars = 10;
    const filledBars = Math.floor((current / max) * totalBars);
    const emptyBars = totalBars - filledBars;
    return "█".repeat(filledBars) + "░".repeat(emptyBars);
}

cmd({
    pattern: "rank",
    desc: "Check your rank and XP with LUCVOICE-XMD branding",
    category: "fun",
    react: "🏆",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const userId = m.sender;

        // Initialize user XP if not exists
        if (!userXP[userId]) {
            userXP[userId] = { xp: 0, level: 1 };
        }

        // Random XP gain per command
        const gain = Math.floor(Math.random() * 15) + 5;
        userXP[userId].xp += gain;

        // Level up logic
        const requiredXP = userXP[userId].level * 100;
        if (userXP[userId].xp >= requiredXP) {
            userXP[userId].xp -= requiredXP;
            userXP[userId].level += 1;
            reply(`🎉 Congratulations! You leveled up to Level ${userXP[userId].level}!`);
        }

        saveXP();

        const xpBar = generateXPBar(userXP[userId].xp, requiredXP);

        // Rank message with LUCVOICE-XMD branding
        reply(`
╭━━━〔 🏆 LUCVOICE-XMD RANK 〕━━━╮
┃ 👤 User    : ${m.pushName || "User"}
┃ ⚡ Level   : ${userXP[userId].level}
┃ 💫 XP      : ${userXP[userId].xp}/${requiredXP}
┃ 🔋 Progress: [${xpBar}]
┃ 🎁 Gained  : +${gain} XP
╰━━━━━━━━━━━━━━━━━━━━━━╯
        `);

    } catch (error) {
        console.error(error);
        reply("❌ Error checking rank!");
    }
});

// Optional leaderboard with LUCVOICE-XMD branding
cmd({
    pattern: "leaderboard",
    desc: "Show top users by level with LUCVOICE-XMD branding",
    category: "fun",
    react: "🥇",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const sortedUsers = Object.entries(userXP)
            .sort(([, a], [, b]) => b.level - a.level || b.xp - a.xp)
            .slice(0, 10);

        let leaderboard = "🥇 *LUCVOICE-XMD Leaderboard*\n\n";
        sortedUsers.forEach(([id, data], index) => {
            leaderboard += `${index + 1}. ${id.split("@")[0]} - Level ${data.level} (${data.xp} XP)\n`;
        });

        reply(leaderboard);

    } catch (err) {
        console.error(err);
        reply("❌ Error fetching leaderboard!");
    }
});

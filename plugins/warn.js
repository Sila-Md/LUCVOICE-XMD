const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

// File to store warnings
const warnFile = path.join(__dirname, 'warnings.json');
let warnings = {};

// Load existing warnings
if (fs.existsSync(warnFile)) {
    warnings = JSON.parse(fs.readFileSync(warnFile));
}

// Save warnings to file
function saveWarnings() {
    fs.writeFileSync(warnFile, JSON.stringify(warnings, null, 2));
}

cmd({
    pattern: "warn",
    desc: "Warn a group member",
    category: "group",
    react: "⚠️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup, isBotAdmin, isAdmin }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups!");
        if (!isAdmin) return reply("❌ Only admins can issue warnings!");
        if (!m.quoted) return reply("❌ Reply to the member you want to warn!");

        const userId = m.quoted.sender;

        // Initialize warning if not exists
        if (!warnings[from]) warnings[from] = {};
        if (!warnings[from][userId]) warnings[from][userId] = 0;

        warnings[from][userId] += 1;
        saveWarnings();

        const count = warnings[from][userId];

        reply(`⚠️ User @${userId.split("@")[0]} has been warned!\nTotal warnings: ${count}`, { mentions: [userId] });

        // Optional: auto-kick after 3 warnings
        if (count >= 3) {
            if (!isBotAdmin) return reply("❌ I need admin rights to kick members!");
            await conn.groupParticipantsUpdate(from, [userId], "remove");
            reply(`❌ User @${userId.split("@")[0]} has been removed from the group after 3 warnings!`, { mentions: [userId] });
            warnings[from][userId] = 0; // reset warnings after kick
            saveWarnings();
        }

    } catch (error) {
        console.error(error);
        reply("❌ Error warning the user!");
    }
});

// Command to check warnings
cmd({
    pattern: "warns",
    desc: "Check warnings for a member",
    category: "group",
    react: "📊",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups!");
        if (!m.quoted) return reply("❌ Reply to the member to check warnings!");

        const userId = m.quoted.sender;
        const count = warnings[from]?.[userId] || 0;

        reply(`📌 User @${userId.split("@")[0]} has ${count} warning(s).`, { mentions: [userId] });

    } catch (error) {
        console.error(error);
        reply("❌ Error checking warnings!");
    }
});

const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

// Path to store blocked users
const blockFile = path.join(__dirname, 'blocked.json');

// Load blocked users from file
let blocked = [];
if (fs.existsSync(blockFile)) {
    blocked = JSON.parse(fs.readFileSync(blockFile));
}

// Save blocked users to file
const saveBlocked = () => {
    fs.writeFileSync(blockFile, JSON.stringify(blocked, null, 2));
};

cmd({
    pattern: "block",
    desc: "Block a user",
    category: "main",
    react: "🚫",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!mek.mentionedJid || mek.mentionedJid.length === 0)
            return reply("❌ Please mention a user to block. Example: .block @user");

        mek.mentionedJid.forEach(user => {
            if (!blocked.includes(user)) blocked.push(user);
        });

        saveBlocked();
        reply(`✅ User(s) blocked successfully!`);
    } catch (e) {
        console.error(e);
        reply("❌ Error blocking user!");
    }
});

cmd({
    pattern: "unblock",
    desc: "Unblock a user",
    category: "main",
    react: "✅",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!mek.mentionedJid || mek.mentionedJid.length === 0)
            return reply("❌ Please mention a user to unblock. Example: .unblock @user");

        mek.mentionedJid.forEach(user => {
            blocked = blocked.filter(u => u !== user);
        });

        saveBlocked();
        reply(`✅ User(s) unblocked successfully!`);
    } catch (e) {
        console.error(e);
        reply("❌ Error unblocking user!");
    }
});

cmd({
    pattern: "blocklist",
    desc: "Show blocked users",
    category: "main",
    react: "📋",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        if (blocked.length === 0) return reply("📋 Blocklist is empty.");

        let listText = "🚫 Blocked Users:\n\n";
        blocked.forEach((user, i) => {
            listText += `${i + 1}. @${user.split("@")[0]}\n`;
        });

        await conn.sendMessage(from, { text: listText, mentions: blocked });
    } catch (e) {
        console.error(e);
        reply("❌ Error fetching blocklist!");
    }
});

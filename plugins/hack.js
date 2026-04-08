const { cmd } = require('../command');

cmd({
    pattern: "hack",
    desc: "Simulate hacking a user (fun/fake command)",
    category: "fun",
    react: "💻",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args || args.length === 0) return reply("❌ Mention a user to hack. Example: .hack @username");
        if (!mek.mentionedJid || mek.mentionedJid.length === 0) return reply("❌ Please mention a user!");

        const target = mek.mentionedJid[0].split("@")[0];
        reply(`💻 Initiating hack on @${target}...`, { mentions: [mek.mentionedJid[0]] });

        setTimeout(() => {
            conn.sendMessage(from, { text: `🔍 Bypassing security systems for @${target}...`, mentions: [mek.mentionedJid[0]] });
        }, 2000);

        setTimeout(() => {
            conn.sendMessage(from, { text: `📂 Accessing data...\n💾 Retrieving passwords for @${target}...`, mentions: [mek.mentionedJid[0]] });
        }, 4000);

        setTimeout(() => {
            const fakePassword = Math.random().toString(36).slice(-8);
            conn.sendMessage(from, { text: `✅ Hack complete!\n📝 User @${target} “password”: ${fakePassword}\n💾 Data retrieved successfully.`, mentions: [mek.mentionedJid[0]] });
        }, 7000);

    } catch (error) {
        console.error(error);
        reply("❌ Error executing hack simulation!");
    }
});

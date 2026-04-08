const { cmd } = require('../command');

cmd({
    pattern: "groupe",
    desc: "Advanced group management",
    category: "group",
    react: "🛡️",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!m.isGroup) return reply("❌ This command is only for groups!");
        if (!args || args.length === 0) return reply(`❌ Usage:\n.groupe info\n.groupe admins\n.groupe kick @user\n.groupe promote @user\n.groupe demote @user\n.groupe setname <name>\n.groupe setdesc <description>\n.groupe invite`);

        const action = args[0].toLowerCase();
        const groupMetadata = await conn.groupMetadata(from);

        switch(action) {
            case "info":
                const groupName = groupMetadata.subject;
                const groupDesc = groupMetadata.desc || "No description";
                const totalMembers = groupMetadata.participants.length;
                const adminList = groupMetadata.participants.filter(p => p.admin).map(a => `@${a.id.split("@")[0]}`).join(", ");
                reply(`📌 *Group Info*\n📝 Name: ${groupName}\n🗒 Description: ${groupDesc}\n👥 Members: ${totalMembers}\n👑 Admins: ${adminList}`, { mentions: groupMetadata.participants.map(p => p.id) });
                break;

            case "admins":
                const admins = groupMetadata.participants.filter(p => p.admin).map(a => `@${a.id.split("@")[0]}`).join("\n");
                reply(`👑 *Admins*\n${admins}`, { mentions: groupMetadata.participants.filter(p => p.admin).map(a => a.id) });
                break;

            case "members":
                const members = groupMetadata.participants.map(p => `@${p.id.split("@")[0]}`).join("\n");
                reply(`👥 *Members*\n${members}`, { mentions: groupMetadata.participants.map(p => p.id) });
                break;

            case "kick":
                if (!mek.mentionedJid || mek.mentionedJid.length === 0) return reply("❌ Mention a user to kick!");
                await conn.groupParticipantsUpdate(from, [mek.mentionedJid[0]], "remove");
                reply(`✅ @${mek.mentionedJid[0].split("@")[0]} has been removed!`);
                break;

            case "promote":
                if (!mek.mentionedJid || mek.mentionedJid.length === 0) return reply("❌ Mention a user to promote!");
                await conn.groupParticipantsUpdate(from, [mek.mentionedJid[0]], "promote");
                reply(`✅ @${mek.mentionedJid[0].split("@")[0]} promoted to admin!`);
                break;

            case "demote":
                if (!mek.mentionedJid || mek.mentionedJid.length === 0) return reply("❌ Mention a user to demote!");
                await conn.groupParticipantsUpdate(from, [mek.mentionedJid[0]], "demote");
                reply(`✅ @${mek.mentionedJid[0].split("@")[0]} demoted!`);
                break;

            case "setname":
                const newName = args.slice(1).join(" ");
                if (!newName) return reply("❌ Provide a new group name.");
                await conn.groupUpdateSubject(from, newName);
                reply(`✅ Group name updated to: ${newName}`);
                break;

            case "setdesc":
                const newDesc = args.slice(1).join(" ");
                if (!newDesc) return reply("❌ Provide a new description.");
                await conn.groupUpdateDescription(from, newDesc);
                reply("✅ Group description updated!");
                break;

            case "invite":
                const inviteCode = await conn.groupInviteCode(from);
                reply(`🔗 Group invite link:\nhttps://chat.whatsapp.com/${inviteCode}`);
                break;

            default:
                reply("❌ Unknown action. Use: info, admins, members, kick, promote, demote, setname, setdesc, invite");
        }

    } catch (err) {
        console.error(err);
        reply("❌ Error executing group command!");
    }
});

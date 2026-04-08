const { cmd } = require('../command');

cmd({
    pattern: "profile",
    desc: "View or edit your profile",
    category: "main",
    react: "👤",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args || args.length === 0) {
            // View profile
            const userName = m.pushName || "No name set";
            const about = m.status || "No status set";

            reply(`👤 *Profile Info*\n\n📝 Name: ${userName}\n💬 Status: ${about}`);
        } else {
            const subCommand = args[0].toLowerCase();

            switch (subCommand) {
                case "setname":
                    const newName = args.slice(1).join(" ");
                    if (!newName) return reply("❌ Please provide a new name. Example: .profile setname John");
                    await conn.updateProfileName(newName);
                    reply(`✅ Your name has been updated to: ${newName}`);
                    break;

                case "setstatus":
                    const newStatus = args.slice(1).join(" ");
                    if (!newStatus) return reply("❌ Please provide a new status. Example: .profile setstatus Hello!");
                    await conn.updateProfileStatus(newStatus);
                    reply(`✅ Your status has been updated to: ${newStatus}`);
                    break;

                case "setpfp":
                    if (!m.quoted || !m.quoted.image) return reply("❌ Please reply to an image to set as profile picture.");
                    const media = await conn.downloadMediaMessage(m.quoted);
                    await conn.updateProfilePicture(media);
                    reply("✅ Profile picture updated!");
                    break;

                default:
                    reply("❌ Unknown subcommand. Use: setname, setstatus, setpfp");
            }
        }
    } catch (error) {
        console.error(error);
        reply("❌ Error executing profile command!");
    }
});

const { cmd } = require('../command');
const axios = require('axios');

const surahList = [
    "Al-Fatiha","Al-Baqarah","Al-Imran","An-Nisa","Al-Ma'idah","Al-An'am","Al-A'raf","Al-Anfal",
    "At-Tawbah","Yunus","Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf",
    "Maryam","Ta-Ha","Al-Anbiya","Al-Hajj","Al-Mu'minun","An-Nur","Al-Furqan","Ash-Shu'ara","An-Naml",
    "Al-Qasas","Al-Ankabut","Ar-Rum","Luqman","As-Sajda","Al-Ahzab","Saba","Fatir","Ya-Sin","As-Saffat",
    "Sad","Az-Zumar","Ghafir","Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiya","Al-Ahqaf",
    "Muhammad","Al-Fath","Al-Hujurat","Qaf","Adh-Dhariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman",
    "Al-Waqia","Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahina","As-Saff","Al-Jumua","Al-Munafiqun",
    "At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haqqah","Al-Maarij","Nuh","Al-Jinn",
    "Al-Muzzammil","Al-Muddathir","Al-Qiyama","Al-Insan","Al-Mursalat","An-Naba","An-Naziat","Abasa",
    "At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq","Al-Ala","Al-Ghashiya",
    "Al-Fajr","Al-Balad","Ash-Shams","Al-Lail","Ad-Duhaa","Ash-Sharh","At-Tin","Al-Alaq","Al-Qadr",
    "Al-Bayyina","Az-Zalzala","Al-Adiyat","Al-Qaria","At-Takathur","Al-Asr","Al-Humaza","Al-Fil",
    "Quraysh","Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr","Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"
];

cmd({
    pattern: "quran",
    desc: "Get Quran Surah or Ayah",
    category: "religion",
    react: "📖",
    filename: __filename
},
async (conn, mek, m, { from, reply, args, s }) => {
    try {
        let infoMsg = `
🕋 ┈─• *HOLY QURAN* •─┈ 🕋

💫 To get specific Surah or Ayah, type: ${s.PREFIXE}quran <Surah> <Ayah Number> 💫

📖 Surah List:
${surahList.map((s, i) => `${i + 1}. ${s}`).join("\n")}

🎮 BY *LUCVOICE-XMD*
`;

        if (!args || args.length === 0) {
            return reply(infoMsg);
        }

        // Example: args = ["Al-Fatiha", "1"]
        const surah = args[0];
        const ayah = args[1] || "";

        // Fetch ayah from API
        const apiUrl = ayah 
            ? `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/en.asad` // English translation
            : `https://api.alquran.cloud/v1/surah/${surah}/en.asad`; // whole Surah

        const res = await axios.get(apiUrl);
        const data = res.data.data;

        let resultText = "";

        if (ayah) {
            resultText = `📖 ${data.surah.name} ${data.numberInSurah}:\n${data.text}\n\nTranslation:\n${data.text}`;
        } else {
            resultText = `📖 ${data.englishName} - ${data.englishNameTranslation}\n\nAyahs:\n${data.ayahs.map(a => `${a.numberInSurah}: ${a.text}`).join("\n")}`;
        }

        return reply(`${resultText}\n\n🕋 Powered by LUKA iT`);

    } catch (error) {
        console.error(error);
        return reply(`❌ Error fetching Quran Surah or Ayah!\n\n🕋 Powered by LUKA iT`);
    }
});

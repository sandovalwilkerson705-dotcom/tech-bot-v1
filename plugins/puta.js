const keywords = ['puta', 'puta', 'canni', 'canni'];
const creatorNumber = '666';

// Objeto para guardar últimos usos de keywords
let lastKeywordUse = {};

// 🎭 Lista de stickers para "puta"
const xdStickers = [
    'https://raw.githubusercontent.com/UploadsAdonix/archivos/main/1763219268984-97d6ce.webp',
    'https://files.catbox.moe/by3el5.webp',
    'https://files.catbox.moe/xfh3zg.webp'
];

// 🎭 Lista de stickers para "puta" (sin el punto)
const putaStickers = [
    'https://files.catbox.moe/by3el5.webp',
    'https://files.catbox.moe/xfh3zg.webp'
];

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

export async function before(m, { conn }) {
    const text = m.text.toLowerCase();

    // 📜 Si escriben "reglas"
    if (/^reglas$/i.test(m.text)) {
        const reglas = `🌐 *REGLAS DEL BOT TECH BOT V1* 🌐
🕶️ *La oscuridad no tolera el caos. Respeta las reglas y serás escuchado.*`;

        await conn.sendMessage(
            m.chat,
            {
                image: { url: 'https://n.uguu.se/ZZHiiljb.jpg' },
                caption: reglas
            },
            { quoted: m }
        );
        return;
    }

    // 🎭 Si escriben "puta" → siempre responde con sticker aleatorio
    if (/^xd$/i.test(m.text)) {
        const randomSticker = pickRandom(xdStickers);
        await conn.sendMessage(
            m.chat,
            { sticker: { url: randomSticker } },
            { quoted: m }
        );
        return;
    }

    // 🎭 Si escriben "puta" (sin el punto) → envía sticker aleatorio
    if (/^puta$/i.test(m.text)) {
        const randomSticker = pickRandom(putaStickers);
        await conn.sendMessage(
            m.chat,
            { sticker: { url: randomSticker } },
            { quoted: m }
        );
        return;
    }

    // 👋 Si contiene palabra clave con cooldown de 2 horas
    const hasKeyword = keywords.some(k => text.includes(k.toLowerCase()));
    if (hasKeyword) {
        const now = Date.now();
        const lastUse = lastKeywordUse[m.chat] || 0;
        const cooldown = 2 * 60 * 60 * 1000; // 2 horas en ms

        if (now - lastUse >= cooldown) {
            lastKeywordUse[m.chat] = now; // actualizar último uso
            return conn.reply(
                m.chat,
                `👋 *Hola soy tech bot v1.*\nUsa *.puta* para ver a la putita de canni.`,
                m
            );
        }
    }

    return !0;
}
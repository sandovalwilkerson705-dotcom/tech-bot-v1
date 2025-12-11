// 🎭 Lista de stickers para "puta"
const xdStickers = [
    'https://raw.githubusercontent.com/UploadsAdonix/archivos/main/1763219268984-97d6ce.webp',
    'https://raw.githubusercontent.com/UploadsAdonix/archivos/main/1763219298568-dd6d8c.webp',
    'https://raw.githubusercontent.com/UploadsAdonix/archivos/main/1763219283881-c7393d.webp'
];

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

export async function before(m, { conn }) {
    const text = m.text.toLowerCase();
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

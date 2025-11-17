const handler = async (msg, { conn }) => {
  try {
    const chatId = msg.key.remoteJid;
    const sender = (msg.key.participant || msg.key.remoteJid).replace(/[^0-9]/g, '');
    const isGroup = chatId.endsWith('@g.us');

    await conn.sendMessage(chatId, { react: { text: '🎄', key: msg.key } });

    if (!isGroup) {
      await conn.sendMessage(chatId, {
        text: `❒ Este comando solo puede ejecutarse dentro de grupos.`,
        quoted: msg
      });
      return;
    }

    const metadata = await conn.groupMetadata(chatId);
    const participants = metadata.participants;
    const mentionIds = participants.map(p => p.id);

    const messageText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    const args = messageText.trim().split(' ').slice(1);
    const extraMsg = args.join(' ');

    let texto = 
`┏━━━━━━━━━━━━━━━━━━━┓
🎅 *Invocación Navideña de las Sombras* 🎅
┗━━━━━━━━━━━━━━━━━━━┛

✐ Grupo: *${metadata.subject}*
ⴵ Miembros: *${participants.length}*`;

    if (extraMsg) texto += `\n✰ Mensaje: *${extraMsg}*`;

    texto += `\n\n❒ Menciones:\n`;
    texto += participants.map(p => `» @${p.id.split('@')[0]}`).join('\n');

    texto += `\n\n❄️ Versión: *${vs}*\n`;
    texto += `\n✨ "Las sombras celebran bajo la nieve... ¿Quién más desea ser invocado en esta noche eterna?" ✨`;

    await conn.sendMessage(chatId, {
      text: texto,
      mentions: mentionIds
    }, { quoted: msg });

  } catch (error) {
    console.error('❌ Error en el comando tagall:', error);
    await conn.sendMessage(msg.key.remoteJid, {
      text: `❒ Ocurrió un error al ejecutar el comando *tagall*.`,
      quoted: msg
    });
  }
};

handler.tags = ['grupo'];
handler.help = ['invocar'];
// ✅ Ahora funciona con y sin prefijo
handler.command = /^(tagall|invocar|todos)$/i;
handler.group = true;
handler.admin = true;

export default handler;

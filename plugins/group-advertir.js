const handler = async (m, { conn, text, command, usedPrefix }) => {
  const emoji = '⚠️';
  const maxWarn = 3;

  // Obtener candidato a advertir
  let who;
  if (m.isGroup) {
    const mentions = m.mentionedJid || [];
    if (mentions.length > 0) {
      who = mentions[0];
    } else if (m.quoted && m.quoted.sender) {
      who = m.quoted.sender;
    } else {
      // Si no hay mención ni quoted, no se puede determinar el usuario
      const warntext = `${emoji} Etiqueta a una persona o responde a un mensaje del grupo para advertir al usuario.`;
      return conn.reply(m.chat, warntext, m);
    }
  } else {
    // En privado, advertir al propio chat
    who = m.chat;
  }

  // Protección: no advertir al bot ni a ti mismo
  const botJid = conn.user.jid;
  if (who === botJid) {
    return conn.reply(m.chat, `${emoji} No puedo advertirme a mí mismo, sombras.`, m);
  }
  if (who === m.sender) {
    return conn.reply(m.chat, `${emoji} No puedes advertirte a ti mismo.`, m);
  }

  // Protección: no advertir a owners
  try {
    const owners = (global.owner || []).map(v => (Array.isArray(v) ? v[0] : v)).filter(Boolean);
    const whoNumber = String(who).split('@')[0];
    if (owners.includes(whoNumber)) {
      return conn.reply(m.chat, `🌌❄️ No se puede advertir a un propietario del Shadow-BOT-MD.`, m);
    }
  } catch { /* silencioso */ }

  // Motivo limpio (sin menciones crudas en el texto)
  const dReason = 'Sin motivo';
  const msgtext = text || dReason;
  const sdms = msgtext.replace(/@\d{5,}[^\s]*/g, '').trim();

  // Asegurar estructura de usuario en DB
  global.db.data.users[who] = global.db.data.users[who] || {};
  const user = global.db.data.users[who];
  user.warn = user.warn || 0;

  // Incrementar advertencia
  user.warn += 1;

  // Aviso de advertencia
  await conn.reply(
    m.chat,
    `🎄🌌 *Advertencia invocada por el Shadow Garden*\n` +
    `*Usuario:* @${String(who).split('@')[0]}\n` +
    `*Motivo:* ${sdms}\n` +
    `*Advertencias:* ${user.warn}/${maxWarn}`,
    m,
    { mentions: [who] }
  );

  // Si alcanza el máximo, expulsar y reiniciar contador
  if (user.warn >= maxWarn) {
    user.warn = 0;
    await conn.reply(
      m.chat,
      `${emoji} Te lo advertí varias veces.\n` +
      `@${String(who).split('@')[0]} superó las *${maxWarn}* advertencias, ` +
      `y será sellado fuera del grupo por las sombras.`,
      m,
      { mentions: [who] }
    );
    // Requiere bot admin
    await conn.groupParticipantsUpdate(m.chat, [who], 'remove');
  }

  return true;
};

handler.command = ['advertir', 'advertencia', 'warn', 'warning'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;

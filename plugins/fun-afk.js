// Middleware que vigila el estado AFK
export function before(m, { conn }) {
  const user = global.db.data.users[m.sender];
  
  // Cuando el usuario regresa de AFK
  if (user.afk > -1) {
    conn.reply(
      m.chat,
      `🌌🎄 *Has regresado del silencio sombrío...*\n` +
      `${user.afkReason ? '❄️ *Motivo de tu retiro*: ' + user.afkReason : ''}\n\n` +
      `✨ *Tiempo en las sombras*: ${msToTime(new Date - user.afk)}\n\n` +
      `🎅 El Shadow Garden celebra tu retorno bajo la nieve.`,
      m
    );
    user.afk = -1;
    user.afkReason = '';
  }

  // Aviso cuando se etiqueta a alguien AFK
  const jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])];
  for (const jid of jids) {
    const user = global.db.data.users[jid];
    if (!user) continue;

    const afkTime = user.afk;
    if (!afkTime || afkTime < 0) continue;

    const reason = user.afkReason || '';
    conn.reply(
      m.chat,
      `❄️🌌 *El alma invocada está en reposo sombrío...*\n` +
      `${reason ? '🎄 *Motivo*: ' + reason : ''}\n\n` +
      `✨ No lo etiquetes, pues el Shadow Garden protege su descanso.`,
      m
    );
  }
  return true;
}

// Comando para activar AFK
let handler = async (m, { conn, text }) => {
  let user = global.db.data.users[m.sender];
  user.afk = +new Date;
  user.afkReason = text || '';
  conn.reply(
    m.chat,
    `🌌❄️ *Has entrado en modo AFK...*\n${text ? '🎄 Motivo: ' + text : ''}`,
    m
  );
};

handler.help = ['afk [razón]'];
handler.tags = ['tools'];
handler.command = ['afk'];

export default handler;

// Función auxiliar para mostrar tiempo AFK en formato legible
function msToTime(ms) {
  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  seconds = seconds % 60;
  minutes = minutes % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

/**
 * ⋆｡˚☁︎｡⋆｡˚☽˚｡⋆ ✦ 𝑹𝒊𝒕𝒖𝒂𝒍 𝑺𝒉𝒂𝒅𝒐𝒘 ✦⋆｡˚☁︎｡⋆｡˚☽˚｡⋆
 *
 * 𝐓𝐡𝐞 𝐄𝐦𝐢𝐧𝐞𝐧𝐜𝐞 𝐢𝐧 𝐒𝐡𝐚𝐝𝐨𝐰: 𝑷𝒂𝒄𝒕𝒐𝒔 𝑶𝒄𝒖𝒍𝒕𝒐𝒔
 *
 * "Solo aquellos que susurran su nombre en la oscuridad
 * pueden sellar un pacto con el Reino de las Sombras..."
 *
 * ┏━━━━━━━━━━━━━━━━━━━━━━━┓
 * ┃    ☽ tech bot code ☽     ┃
 * ┗━━━━━━━━━━━━━━━━━━━━━━━┛
 */

import db from '../lib/database.js'
import fs from 'fs'
import PhoneNumber from 'awesome-phonenumber'
import { createHash} from 'crypto'
import fetch from 'node-fetch'
import moment from 'moment-timezone'

const SelloMistico = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async function (m, { conn, text, usedPrefix, command}) {
  const who = m.mentionedJid?.[0] || (m.fromMe? conn.user.jid: m.sender)
  const mentionedJid = [who]
  const pp = await conn.profilePictureUrl(who, 'image').catch(() => 'https://files.catbox.moe/xr2m6u.jpg')
  const user = global.db.data.users[m.sender]
  const name2 = conn.getName(m.sender)

  if (user.registered) {
    return m.reply(`『☽』 Ya has sellado un pacto, ${name2}-kun... (｡•́︿•̀｡)

¿Deseas romper el sello y renacer?
Usa *${usedPrefix}unreg* para disolver el vínculo actual.`)
}

  if (!SelloMistico.test(text)) {
    return m.reply(`『⚠️』 El ritual fue mal pronunciado... (；⌣̀_⌣́)

✧ Formato correcto: *${usedPrefix + command} nombre.edad*
✧ Ejemplo: *${usedPrefix + command} ${name2}.18*

Solo los que dominan el arte oculto pueden invocar correctamente...`)
}

  let [_, name, __, age] = text.match(SelloMistico)

  if (!name) return m.reply('『✘』 El nombre es la clave del alma... no puede estar vacío (｡•́︿•̀｡)')
  if (!age) return m.reply('『✘』 La edad es el tributo al pacto... (╯°□°）╯︵ ┻━┻')
  if (name.length>= 100) return m.reply('『✘』 Ese nombre es demasiado largo... ¿Eres una entidad ancestral? (⊙_☉)')

  age = parseInt(age)
  if (age> 1000) return m.reply('『☠️』 ¿Eres un espíritu eterno como yo...? (◐.̃◐)')
  if (age < 5) return m.reply('『⚠️』 Los niños no deben jugar con las sombras... (；⌣̀_⌣́)')

  user.name = `${name}⋆⟡𝑺𝒉𝒂𝒅𝒐𝒘⟡⋆`.trim()
  user.age = age
  user.regTime = +new Date()
  user.registered = true

  user.coin += 46
  user.exp += 310
  user.joincount += 25

  const sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)

  const certificadoPacto = `
╭─「 ☽ pacto Tech bot ☽ 」─╮
│ ✧ *Nombre:* ${name}
│ ✧ *Edad:* ${age} años
│ ✧ *Sello Único:* ${sn}
│
├─ ✦ 𝑩𝒆𝒏𝒅𝒊𝒄𝒊𝒐𝒏𝒆𝒔 𝑶𝒄𝒖𝒍𝒕𝒂𝒔:
│ 🪙 shadowCoins: +46
│ 🔮 Energía Oscura: +310
│ 🕯️ Sellos de Invocación: +25
│
├─ "El poder oculto ahora fluye en ti..."
╰─「 ☽ Eminemce un tech bot ☽ 」─╯
`.trim()

  await m.react('🌑')

  await conn.sendMessage(m.chat, {
    text: certificadoPacto,
    contextInfo: {
      externalAdReply: {
        title: '☽ Pacto Shadow Completado ☽',
        body: 'El poder oculto ha sido sellado...',
        thumbnailUrl: pp,
        sourceUrl: 'https://whatsapp.com/channel/0029VayXJte65yD6LQGiRB0R',
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true
}
}
}, { quoted: m})

  const reinoEspiritual = '120363420632316786@g.us'
  const mensajeNotificacion = `
╭─「 🌒 𝑵𝒖𝒆𝒗𝒐 tech bot 𝑨𝒔𝒊𝒔𝒕𝒆𝒏𝒕𝒆 🌒 」─╮
│ ✧ *Nombre:* ${name}
│ ✧ *Edad:* ${age} años
│ ✧ *Sello:* ${sn}
│
├─ ✦ Bendiciones Oscuras:
│ 🪙 shadowCoins: +46
│ 🔮 Energía: +310
│ 🕯️ Sellos: +25
│
│ 📜 *Fecha del Pacto:* ${moment().format('YYYY-MM-DD HH:mm:ss')}
╰─「 𝑬𝒎𝒊𝒏𝒆𝒏𝒄𝒆 𝒊𝒏 tech bot 」─╯
> 🕶️ tech bot`

  try {
    if (global.conn?.sendMessage) {
      const ppGroup = await conn.profilePictureUrl(who, 'image').catch(() => null)
      await global.conn.sendMessage(reinoEspiritual, {
        image: { url: ppGroup || pp},
        caption: mensajeNotificacion
})
}
} catch (e) {
    console.error('⚠️ Error al notificar al Reino Shadow:', e)
}
}

handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar']

export default handler

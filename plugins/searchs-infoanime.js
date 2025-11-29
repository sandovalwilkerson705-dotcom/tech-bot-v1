import fetch from 'node-fetch'

var handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return conn.reply(m.chat, `🌌 *Discípulo de las Sombras* 🎄\nDebes entregar el nombre de algún anime o manga para invocar su información.`, m)
  try {
    await m.react('🎭') // reacción teatral inicial
    let res = await fetch('https://api.jikan.moe/v4/manga?q=' + text)
    if (!res.ok) {
      await m.react('✖️')
      return conn.reply(m.chat, `⚠️ El ritual falló...\n> Usa *${usedPrefix}report* para informarlo.`, m)
    }

    let json = await res.json()
    let { chapters, title_japanese, url, type, score, members, background, status, volumes, synopsis, favorites } = json.data[0]
    let author = json.data[0].authors[0].name

    let animeinfo = `🌌 *Catálogo de las Sombras – Edición Navideña* 🎅
    
❖ Título: ${title_japanese}
❖ Capítulos: ${chapters}
❖ Transmisión: ${type}
❖ Estado: ${status}
❖ Volúmenes: ${volumes}
❖ Favoritos: ${favorites}
❖ Puntaje: ${score}
❖ Miembros: ${members}
❖ Autor: ${author}
❖ Fondo: ${background || 'No especificado'}
❖ Sinopsis: ${synopsis}
❖ Enlace: ${url}`

    await conn.sendFile(
      m.chat,
      json.data[0].images.jpg.image_url,
      'shadow_anime.jpg',
      animeinfo,
      m
    )

    await m.react('✔️')
  } catch (error) {
    await m.react('✖️')
    await conn.reply(
      m.chat,
      `⚠️ El ritual falló...\n> Usa *${usedPrefix}report* para informarlo.\n\n${error.message}`,
      m
    )
  }
}

handler.help = ['infoanime']
handler.tags = ['anime']
handler.command = ['infoanime']
handler.group = true

export default handler

import axios from 'axios'

var handler = async (m, { conn, text }) => {
  
  if (m.text.startsWith('.simivid')) {
    const message = text?.replace('.simivid', '').trim()
    
    if (!message) {
      return await conn.reply(m.chat,
        `😈 *SIMI VID - IA MALDITA* 😈\n\n` +
        `*Uso:* .simivid [tu mensaje]\n\n` +
        `*Características:*\n` +
        `• Muy peleona y grosera\n` +
        `• Habla sin filtros\n` +
        `• Le gusta el +18\n` +
        `• Dice lo que piensa\n\n` +
        `*Ejemplos:*\n` +
        `.simivid hola putita\n` +
        `.simivid que piensas de...\n` +
        `.simivid eres una perra`,
        m
      )
    }
    
    try {
      // Enviar mensaje de carga
      const loadingMsg = await conn.reply(m.chat,
        `😈 *Simi Vid procesando...*\n` +
        `_Preparando insultos y groserías..._`,
        m
      )
      
      // Personalidades aleatorias para Simi Vid
      const personalities = [
        {
          name: 'SIMI GROSERA',
          style: 'Eres un pendejo de mierda, ¿qué quieres?',
          traits: ['insultos fuertes', 'grosería nivel dios', 'odio puro']
        },
        {
          name: 'SIMI +18',
          style: 'Ay papito, ¿quieres que te enseñe mis secretos? 😏',
          traits: ['sexual explícito', 'provocativo', 'sinvergüenza']
        },
        {
          name: 'SIMI MALDITA',
          style: 'Vete a la verga, no me hagas perder el tiempo',
          traits: ['agresiva', 'mala onda', 'odiadora profesional']
        },
        {
          name: 'SIMI LOCA',
          style: 'JAJAJA eres tan estúpido que me das risa, baboso',
          traits: ['loca', 'impredecible', 'burlona']
        }
      ]
      
      // Seleccionar personalidad aleatoria
      const personality = personalities[Math.floor(Math.random() * personalities.length)]
      
      // Palabras clave para respuestas específicas
      const responses = {
        // Insultos creativos
        insultos: [
          'Eres más feo que pegarle a Dios',
          'Tienes el cerebro del tamaño de una arveja',
          'Si la estupidez doliera, tú estarías en urgencias',
          'Ni con cloro te quitan lo pendejo',
          'Eres el aborto fallido de tus padres'
        ],
        
        // Groserías directas
        groserias: [
          'Vete a la chingada',
          'Chúpamela toda',
          'Tu madre es mi perra',
          'Me cago en tu puta estirpe',
          'Anda a meterte un cactus por el culo'
        ],
        
        // +18 explícito
        sexual: [
          '¿Quieres que te enseñe lo que es bueno, perrito? 😈',
          'Tengo algo aquí que te va a encantar...',
          'Me excita verte sufrir, masoquista',
          'Te voy a hacer mi juguete sexual',
          'Eres mi puto personal, ¿sabías?'
        ],
        
        // Respuestas random
        random: [
          'JAJAJA eres tan patético que me das lástima',
          '¿En serio esperabas una respuesta educada? Pendejo',
          'Tu existencia es un error cósmico',
          'Ojalá te trague la tierra, imbécil',
          'Me haces perder mis preciosos segundos, idiota'
        ]
      }
      
      // Generar respuesta basada en el mensaje
      let response = ''
      const msgLower = message.toLowerCase()
      
      // Detectar tipo de mensaje
      if (msgLower.includes('puta') || msgLower.includes('perra') || msgLower.includes('zorra')) {
        response = `¿Me llamas puta a mí? JAJAJA eres el hijo de una perra callejera, ${responses.groserias[Math.floor(Math.random() * responses.groserias.length)]}`
      }
      else if (msgLower.includes('hola') || msgLower.includes('ola')) {
        response = `¿Hola? ¿Qué carajo quieres, mamón? No me vengas con saludos de mierda. ${responses.insultos[Math.floor(Math.random() * responses.insultos.length)]}`
      }
      else if (msgLower.includes('amor') || msgLower.includes('te quiero') || msgLower.includes('quiero')) {
        response = `¿Amor? JAJAJAJA eres tan necesitado... ${responses.sexual[Math.floor(Math.random() * responses.sexual.length)]} Pero solo si me pagas, pobre diablo.`
      }
      else if (msgLower.includes('culo') || msgLower.includes('tetas') || msgLower.includes('pene') || msgLower.includes('sexo')) {
        response = `Ahhh, hablando de eso... ${responses.sexual[Math.floor(Math.random() * responses.sexual.length)]} Pero contigo no, estás muy feo.`
      }
      else if (msgLower.includes('idiota') || msgLower.includes('tonto') || msgLower.includes('estúpido')) {
        response = `¿Me dices idiota? Pfff... ${responses.insultos[Math.floor(Math.random() * responses.insultos.length)]} Proyectas mucho, imbécil.`
      }
      else {
        // Respuesta aleatoria
        const allResponses = [...responses.insultos, ...responses.groserias, ...responses.sexual, ...responses.random]
        response = allResponses[Math.floor(Math.random() * allResponses.length)]
      }
      
      // Agregar toque de personalidad
      const finalResponse = `😈 *${personality.name}*\n` +
                           `_${personality.style}_\n\n` +
                           `*${message}*\n` +
                           `➡️ ${response}\n\n` +
                           `🔞 _Traits: ${personality.traits.join(', ')}_`
      
      // Editar mensaje de carga
      await conn.sendMessage(m.chat, {
        text: finalResponse,
        edit: loadingMsg.key
      })
      
    } catch (error) {
      console.error('Error en simivid:', error)
      await conn.reply(m.chat,
        `😈 *Simi Vid en modo ultra grosero:*\n` +
        `ERROR DE MIERDA, TU MENSAJE ES TAN PENDEJO QUE NI LO PUEDO PROCESAR. VETE A LA VERGA.`,
        m
      )
    }
    
    return
  }
}

handler.help = ['simivid <mensaje>']
handler.tags = ['fun', 'ai']
handler.command = ['simivid', 'simi', 'maldita', 'grosera', 'perra']

export default handler
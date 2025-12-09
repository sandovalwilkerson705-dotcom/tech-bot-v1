import { promises as fs, existsSync } from 'fs'

// Archivo para guardar comandos restringidos
const RESTRICTED_FILE = './restricted_commands.json'

// Cargar comandos restringidos
let restrictedCommands = {}
try {
  if (existsSync(RESTRICTED_FILE)) {
    const data = await fs.readFile(RESTRICTED_FILE, 'utf8')
    restrictedCommands = JSON.parse(data)
  }
} catch (error) {
  restrictedCommands = {}
  await saveRestrictedCommands()
}

// Guardar comandos restringidos
async function saveRestrictedCommands() {
  await fs.writeFile(RESTRICTED_FILE, JSON.stringify(restrictedCommands, null, 2))
}

// Verificar si un comando está restringido en un grupo
function isCommandRestricted(groupId, command) {
  if (!restrictedCommands[groupId]) return false
  return restrictedCommands[groupId].includes(command)
}

// Agregar comando restringido
async function addRestrictedCommand(groupId, command) {
  if (!restrictedCommands[groupId]) {
    restrictedCommands[groupId] = []
  }
  
  if (!restrictedCommands[groupId].includes(command)) {
    restrictedCommands[groupId].push(command)
    await saveRestrictedCommands()
  }
}

// Remover comando restringido
async function removeRestrictedCommand(groupId, command) {
  if (restrictedCommands[groupId]) {
    const index = restrictedCommands[groupId].indexOf(command)
    if (index > -1) {
      restrictedCommands[groupId].splice(index, 1)
      await saveRestrictedCommands()
    }
  }
}

// Limpiar todos los comandos restringidos de un grupo
async function clearRestrictedCommands(groupId) {
  if (restrictedCommands[groupId]) {
    delete restrictedCommands[groupId]
    await saveRestrictedCommands()
  }
}

var handler = async (m, { conn, text, isAdmin, isOwner, isROwner, command }) => {
  
  const groupId = m.chat
  const isGroup = groupId.endsWith('@g.us')
  
  // Comando .re [comando] - Restringir comando
  if (m.text.startsWith('.re ')) {
    if (!isGroup) {
      return await conn.reply(m.chat, '❌ Este comando solo funciona en grupos.', m)
    }
    
    // Verificar permisos (solo admins/owner)
    const userIsAdmin = isAdmin || false
    const userIsOwner = isOwner || isROwner || false
    
    if (!userIsAdmin && !userIsOwner) {
      return await conn.reply(m.chat, 
        '🚫 Solo administradores o el owner pueden restringir comandos.', 
        m
      )
    }
    
    const commandToRestrict = text.trim().split(' ')[1]
    
    if (!commandToRestrict) {
      return await conn.reply(m.chat,
        `🔒 *USO DE RESTRICCIÓN*\n\n` +
        `*Formato:* .re [comando]\n` +
        `*Ejemplo:* .re play\n\n` +
        `*Lista de comandos comunes:*\n` +
        `• play / yt / ytv (descargas)\n` +
        `• sticker / s (stickers)\n` +
        `• gpt / ai (IA)\n` +
        `• gemini (chatbot)\n` +
        `• dice / dado (juegos)\n` +
        `• y todo comando que exista`,
        m
      )
    }
    
    // Normalizar comando (sin punto, minúsculas)
    const normalizedCommand = commandToRestrict.toLowerCase().replace(/^\./, '')
    
    if (normalizedCommand === 're') {
      return await conn.reply(m.chat, '❌ No puedes restringir el comando .re', m)
    }
    
    // Agregar a lista de restringidos
    await addRestrictedCommand(groupId, normalizedCommand)
    
    m.react('🔒')
    await conn.reply(m.chat,
      `✅ *Comando restringido*\n\n` +
      `🔐 El comando *${normalizedCommand}* ahora solo puede ser usado por:\n` +
      `• Administradores del grupo\n` +
      `• Owner del bot\n\n` +
      `_Los miembros normales no podrán usarlo._`,
      m
    )
    
    return
  }
  
  // Comando .re off - Desactivar restricciones
  if (m.text === '.re off') {
    if (!isGroup) {
      return await conn.reply(m.chat, '❌ Este comando solo funciona en grupos.', m)
    }
    
    const userIsAdmin = isAdmin || false
    const userIsOwner = isOwner || isROwner || false
    
    if (!userIsAdmin && !userIsOwner) {
      return await conn.reply(m.chat, 
        '🚫 Solo administradores o el owner pueden usar este comando.', 
        m
      )
    }
    
    // Obtener lista de comandos restringidos actuales
    const currentRestricted = restrictedCommands[groupId] || []
    
    if (currentRestricted.length === 0) {
      return await conn.reply(m.chat,
        'ℹ️ No hay comandos restringidos en este grupo.',
        m
      )
    }
    
    // Limpiar todos los comandos restringidos
    await clearRestrictedCommands(groupId)
    
    m.react('🔓')
    await conn.reply(m.chat,
      `✅ *Restricciones desactivadas*\n\n` +
      `🔓 Se han removido ${currentRestricted.length} comandos restringidos:\n` +
      `• ${currentRestricted.join(', ')}\n\n` +
      `_Todos los miembros pueden usar los comandos nuevamente._`,
      m
    )
    
    return
  }
  
  // Comando .re list - Ver comandos restringidos
  if (m.text === '.re list') {
    if (!isGroup) {
      return await conn.reply(m.chat, '❌ Este comando solo funciona en grupos.', m)
    }
    
    const userIsAdmin = isAdmin || false
    const userIsOwner = isOwner || isROwner || false
    
    if (!userIsAdmin && !userIsOwner) {
      return await conn.reply(m.chat, 
        '🚫 Solo administradores o el owner pueden ver la lista.', 
        m
      )
    }
    
    const currentRestricted = restrictedCommands[groupId] || []
    
    if (currentRestricted.length === 0) {
      return await conn.reply(m.chat,
        '📋 *Lista de comandos restringidos*\n\n' +
        'ℹ️ No hay comandos restringidos en este grupo.\n' +
        'Usa: .re [comando] para restringir',
        m
      )
    }
    
    m.react('📋')
    await conn.reply(m.chat,
      `📋 *COMANDOS RESTRINGIDOS*\n\n` +
      `*Grupo:* ${groupId}\n` +
      `*Total:* ${currentRestricted.length} comandos\n\n` +
      `🔒 *Lista:*\n` +
      currentRestricted.map(cmd => `• .${cmd}`).join('\n') + `\n\n` +
      `_Solo admins/owner pueden usar estos comandos._`,
      m
    )
    
    return
  }
  
  // ===== MIDDLEWARE PARA BLOQUEAR COMANDOS RESTRINGIDOS =====
  // Esta parte se ejecuta automáticamente para todos los comandos
  if (command && isGroup) {
    const commandName = command.toLowerCase()
    
    // Verificar si este comando está restringido en este grupo
    if (isCommandRestricted(groupId, commandName)) {
      // Verificar si el usuario tiene permisos
      const userIsAdmin = isAdmin || false
      const userIsOwner = isOwner || isROwner || false
      
      // Si no es admin ni owner, bloquear el comando
      if (!userIsAdmin && !userIsOwner) {
        m.react('🚫')
        await conn.reply(m.chat,
          `🚫 *Comando restringido*\n\n` +
          `El comando *.${commandName}* está restringido en este grupo.\n\n` +
          `💡 Solo pueden usarlo:\n` +
          `• Administradores del grupo\n` +
          `• Owner del bot\n\n` +
          `_Contacta a un admin si necesitas usar este comando._`,
          m
        )
        return true // Detener la ejecución del comando
      }
    }
  }
}

// Handler para middleware (se ejecuta antes de otros comandos)
handler.before = async (m, { conn, command, isAdmin, isOwner, isROwner }) => {
  const groupId = m.chat
  const isGroup = groupId.endsWith('@g.us')
  
  if (command && isGroup) {
    const commandName = command.toLowerCase()
    
    // Verificar si el comando está restringido
    if (isCommandRestricted(groupId, commandName)) {
      // Verificar permisos
      const userIsAdmin = isAdmin || false
      const userIsOwner = isOwner || isROwner || false
      
      // Bloquear si no tiene permisos
      if (!userIsAdmin && !userIsOwner) {
        // Reacción de bloqueo
        try {
          await conn.sendMessage(groupId, {
            react: { text: '🚫', key: m.key }
          })
        } catch (e) {}
        
        // No enviar mensaje, solo bloquear silenciosamente
        return true // Detiene el comando
      }
    }
  }
  
  return false // Continuar con el comando normal
}

handler.help = [
  're [comando]',
  're off',
  're list'
]
handler.tags = ['group']
handler.command = ['re', 'restrict']
handler.group = true
handler.admin = true

export default handler
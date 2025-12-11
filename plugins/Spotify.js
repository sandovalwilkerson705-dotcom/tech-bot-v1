// Creado por > @WILKER-OFC <
// No quites los créditos

import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return conn.reply(m.chat, 
        `🎵 *Descargador de Spotify*\n\n` +
        `[💜] Ingresa el enlace de Spotify\n\n` +
        `*Ejemplo:* ${usedPrefix + command} https://open.spotify.com/track/...`, 
        m
    );

    try {
        // Usando la nueva API que solicitaste
        const spotifyUrl = encodeURIComponent(args[0]);
        const apiUrl = `https://api-adonix.ultraplus.click/download/spotify?apikey=DemonKeytechbot&url=${spotifyUrl}`;
        
        conn.reply(m.chat, `⬇️ *Descargando audio de Spotify...*`, m);

        const response = await fetch(apiUrl, {
            timeout: 30000 // 30 segundos timeout
        });

        if (!response.ok) throw new Error(`Error API: ${response.status}`);

        const data = await response.json();

        if (!data.success || !data.downloadLink) {
            throw new Error("La API no devolvió un enlace de descarga válido");
        }

        // Enviar el audio
        await conn.sendMessage(m.chat, {
            audio: { url: data.downloadLink },
            mimetype: 'audio/mpeg',
            ptt: false
        }, { quoted: m });

        conn.reply(m.chat, `✅ *Audio descargado correctamente*\n\n_Powered by Chrome Bot_`, m);

    } catch (error) {
        console.error('❌ Error en spotify:', error);
        
        let errorMessage = '❌ *Error al descargar el audio*\n\n';
        
        if (error.message.includes('404') || error.message.includes('No se obtuvo')) {
            errorMessage += '• Enlace de Spotify no válido\n';
            errorMessage += '• La canción podría estar restringida\n';
            errorMessage += '• Verifica que el enlace sea correcto';
        } else if (error.message.includes('timeout')) {
            errorMessage += '• La API tardó demasiado en responder\n';
            errorMessage += '• Intenta nuevamente en unos segundos';
        } else {
            errorMessage += '• Problema con el servidor de descargas\n';
            errorMessage += '• Intenta con otro enlace o más tarde';
        }
        
        conn.reply(m.chat, errorMessage, m);
    }
};

handler.help = ['spotify <url>'];
handler.tags = ['downloader'];
handler.command = ['spotify', 'spotifydl', 'spdl'];

export default handler;
const { Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Events } = require("@models");

/**
 * Clase que implementa la auto-eliminación de mensajes con un diseño más profesional.
 * @extends Events
 */
class AutoDeleteMessage extends Events {
    /**
     * Crea una instancia de AutoDeleteMessage.
     */
    constructor() {
        super('messageCreate');
    }

    /**
     * Método que se ejecuta cuando se dispara el evento.
     * @param {Client} client - El cliente Discord.js.
     * @param {Message} message - El mensaje enviado.
     */
    async run(client, message) {
        // Verificar que el mensaje no es de un bot
        if (message.author.bot) return;

        // Verificar si el mensaje es en el canal correcto
        if (message.channel.id !== '1328922220638240848') {
            return;
        }

        // Expresión regular para validar el formato del mensaje con razón incluida
        const formatRegex = /^NICK:\s*(.+)\s*USUARIO:\s*(.+)\s*RAZÓN:\s*(.+)\s*EVIDENCIA:\s*(https?:\/\/[^\s]+)/i;

        // Ejecutar el regex y capturar coincidencias
        const match = message.content.match(formatRegex);

 if (!match) {
    const errorEmbed = new EmbedBuilder()
        .setTitle('❗ Formato Incorrecto')
        .setDescription('El mensaje no cumple con el formato esperado.')
        .setColor('#ff4d4d')
        .addFields({ name: 'Formato esperado:', value: '```NICK: Juan\nUSUARIO: juan123\nRAZÓN: Es mi copia\nEVIDENCIA: https://example.com/evidencia```' })
        .setFooter({ text: 'Por favor, siga el formato correcto para evitar la eliminación del mensaje.' });
    const botMessage = await message.reply({ embeds: [errorEmbed] });
    setTimeout(() => {
        message.delete().catch(console.error);
        botMessage.delete().catch(console.error);
    }, 15000); // Elimina ambos mensajes después de 15 segundos

    return;
}

        // Extraer la información del mensaje
        const [_, nick, usuario, razon, evidencia] = match;

        console.log(`Nick: ${nick}, Usuario: ${usuario}, Razón: ${razon}, Evidencia: ${evidencia}`);

        // Crear el embed con la información del reporte
        const embed = new EmbedBuilder()
            .setTitle('🎯 Nuevo Reporte Recibido')
            .setDescription('Un nuevo reporte ha sido registrado con los siguientes detalles:')
            .setColor('#00bfff')
            .setThumbnail('https://media.discordapp.net/attachments/1075977268691742742/1329976805393698936/1733576606222-600206760.jpeg?ex=678c4cec&is=678afb6c&hm=ccce410a9c54fb0d27e51f8eb3a21399e227114a9f80b00f2aefe0ec863afe3a&=&format=webp&width=836&height=468')
            .addFields(
                { name: '👤 Nick', value: nick, inline: true },
                { name: '🆔 Usuario', value: usuario, inline: true },
                { name: '📝 Razón', value: razon },
                { name: '📎 Evidencia', value: `[Haz clic aquí](${evidencia})`, inline: true  },
                { name: '📩 Reportado por', value: message.author.tag, inline: true }
            )
            .setFooter({ text: 'Gracias por contribuir a mantener una comunidad segura.', iconURL: 'https://example.com/footer-icon.png' })
            .setTimestamp();

        // Crear los botones de interacción
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('reclamar').setLabel('✅ Reclamar').setStyle(ButtonStyle.Success),
        
        );

        try {
            // Eliminar el mensaje original y enviar el embed con botones
            await message.delete();
            const sentMessage = await message.channel.send({
                content: '✅ **Reporte registrado exitosamente.** Nuestro equipo de moderación lo revisará a la brevedad.',
                embeds: [embed],
                components: [buttons]
            });

            // Eliminar el mensaje de reporte después de un tiempo

        } catch (error) {
            console.error(`Error al procesar el mensaje: ${error}`);
        }
    }
}

module.exports = AutoDeleteMessage;
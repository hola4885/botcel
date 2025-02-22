const { ModalSubmitInteraction, EmbedBuilder, CacheType } = require("discord.js");
const { ModalSubmit } = require("@models");

/**
 * Clase para manejar la lógica asociada al modal para denegar un reporte.
 * @extends ModalSubmit
 */
class DenyModal extends ModalSubmit {
    constructor() {
        super("denyModal");
    }

    /**
     * Ejecuta la lógica cuando el modal es enviado.
     * @param {Client} client - El cliente Discord.js.
     * @param {ModalSubmitInteraction<CacheType>} int - La interacción del modal.
     * @param {Object} data - Datos adicionales, en este caso contiene la información necesaria para crear el embed.
     */
    async run(client, int, data = {}) {
        // Obtener la razón ingresada en el modal
        const reason = int.fields.getTextInputValue('denyReason');
        
        // Crear un embed para mostrar la respuesta de denegación
        const deniedEmbed = new EmbedBuilder()
            .setTitle('🎯 Reporte Denegado')
            .setDescription(`El reporte ha sido denegado por el staff: ${int.user.tag}`)
            .addFields({ name: 'Razón', value: reason })
            .setColor('#8b0505')
            .setTimestamp();

        // Enviar un mensaje confirmando la acción al canal
        await int.reply({
            content: '❌ El reporte ha sido denegado.',
            embeds: [deniedEmbed],
        });

        // Obtener el ID del usuario original que realizó el reporte (deberías obtenerlo de los campos del embed)
        const message = int.message;
        const usuarioId = message.embeds[0].fields.find(field => field.name === '🆔 Usuario').value;

        // Obtener al usuario a quien se le notificará sobre la denegación
        const dmUser = await client.users.fetch(usuarioId);

        // Enviar un mensaje directo al usuario con la razón de la denegación
        await dmUser.send({
            content: `Tu reporte ha sido denegado por el staff: ${int.user.tag}. Razón: ${reason}`
        });
    }
}

module.exports = DenyModal;
const { Events } = require("@models");

/**
 * Clase que implementa la auto-eliminación de mensajes.
 * @extends Events
 */
class AutoDeleteMessages extends Events {
    /**
     * Crea una instancia de AutoDeleteMessages.
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
        // Configuración: ID del canal y tiempo de espera antes de eliminar mensajes
        const targetChannelId = '1328840586861478008'; // Reemplaza con el ID del canal deseado
        const deleteAfterMs = 30 * 60 * 1000;; // Tiempo en milisegundos (1 minuto en este caso)

        // Verifica si el mensaje fue enviado en el canal objetivo
        if (message.channel.id !== targetChannelId) return;

        // Excluye mensajes de bots si es necesario
        if (message.author.bot) return;

        // Configura un temporizador para eliminar el mensaje después de `deleteAfterMs`
        setTimeout(async () => {
            try {
                await message.delete();
            } catch (err) {
                console.error(`Error al eliminar el mensaje: ${err.message}`);
            }
        }, deleteAfterMs);
    }
}

module.exports = AutoDeleteMessages;
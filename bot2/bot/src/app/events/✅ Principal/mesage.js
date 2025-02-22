const { Client } = require("discord.js");
const { Events } = require("@models");
const DeepSeekApi = require('../deepseekApi'); // Importa la clase DeepSeekApi

class mensaje extends Events {
    constructor() {
        super("messageCreate");
        this.deepSeekApi = new DeepSeekApi(process.env.DEEPSEEK_API_KEY); // Inicializa la API de DeepSeek
    }

    /**
     * Método que se ejecuta cuando se dispara el evento.
     * @param {Client} client - El cliente Discord.js.
     * @param {Message} message - El mensaje enviado.
     */
    async run(client, message) {
        // Verificar que el mensaje no es de un bot
        if (message.author.bot) return;

        try {
            let ticket;
            let destinationChannelId;

            // IDs de las categorías permitidas
            const allowedCategories = ["1333935316628668457"]; // Reemplazar con los IDs reales de las categorías permitidas

            // Verificar si el canal está dentro de una categoría permitida
            const channelCategory = message.channel.parentId;
            if (!allowedCategories.includes(channelCategory)) {
                return; // Salir si no pertenece a una categoría válida
            }

            var messageToSend;
            const messageContent = message.content.trim();

            // Verificar si el mensaje proviene de un canal asociado a `remoteTiketId`
            ticket = await admin.findOne({ remoteTiketId: message.channel.id });
            if (ticket) {
                destinationChannelId = ticket.tiketid;
                messageToSend = `${messageContent}`; // Canal opuesto

            } else {
                // Si no es `remoteTiketId`, verificar si proviene de un canal asociado a `tiketid`
                ticket = await admin.findOne({ tiketid: message.channel.id });
                if (ticket) {
                    destinationChannelId = ticket.remoteTiketId;
                    messageToSend = `${message.author.tag}: ${messageContent}`; // Canal opuesto
                }
            }

            // Si no se encontró un ticket asociado, salir
            if (!ticket) {
                console.log("No se encontró un ticket relacionado con este canal.");
                return;
            }

            // Validar formato del mensaje

            // Crear el mensaje a enviar al canal opuesto

            // Obtener el canal de destino
            if (ticket.status !== "open") {
                return;
            }

            const destinationChannel = await client.channels.fetch(destinationChannelId);

            if (destinationChannel) {
                // Enviar el mensaje al canal opuesto
                await destinationChannel.send(messageToSend);

                // Verificar si el mensaje contiene una pregunta específica
                const lowerCaseMessage = messageContent.toLowerCase();
                let response;
/*
                if (lowerCaseMessage.includes("ip") || lowerCaseMessage.includes("dirección del servidor")) {
                    response = "La IP del servidor es: `192.168.1.1`"; // Reemplaza con la IP real
                } else if (lowerCaseMessage.includes("datos") || lowerCaseMessage.includes("información del servidor")) {
                    response = "Aquí tienes algunos datos del servidor:\n- IP: `192.168.1.1`\n- Versión: `1.16.5`\n- Jugadores en línea: `10/50`"; // Reemplaza con los datos reales
                } else if (lowerCaseMessage.includes("ayuda")) {
                    response = "Comandos disponibles:\n- `!ip`: Muestra la IP del servidor.\n- `!datos`: Muestra información del servidor.\n- `!ayuda`: Muestra esta ayuda.";
                } else {
                    // Si no es una pregunta específica, usar la API de DeepSeek
                    response = await this.deepSeekApi.getResponse(messageContent);
                }
*/
                // Enviar la respuesta al canal de destino
                await destinationChannel.send(response);
            } else {
                console.log("No se encontró el canal de destino.");
            }
        } catch (error) {
            console.error("Error al procesar el mensaje:", error);
        }
    }
}

module.exports = mensaje;
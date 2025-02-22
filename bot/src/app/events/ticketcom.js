const { Client } = require("discord.js");
const admin = require("./../../../mongodb/models/problemaA");
const { Events } = require("@models");

class TicketCom extends Events {
    constructor() {
        super("messageCreate");
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

            // IDs de las categorías permitidas 1277131677138812978 1330039456048353320
            const allowedCategories = ["1277131677138812978", "1330039456048353320"]; // Reemplazar con los IDs reales de las categorías permitidas

            // Verificar si el canal está dentro de una categoría permitida
            const channelCategory = message.channel.parentId;

            if (!allowedCategories.includes(channelCategory)) {
                return; // Salir si no pertenece a una categoría válida
            }

            var messageToSend;
            const messageContent = message.content.trim();

            // Verificar si el mensaje proviene de un canal asociado a `remoteTiketId`
            ticket = await admin.findOne({ remoteTiketId: message.channel.id });
            console.log(ticket);
            console.log(message.channel.id);

            if (ticket) {
                destinationChannelId = ticket.tiketid; 
                                    messageToSend = `${messageContent}`;// Canal opuesto

            } else {
                // Si no es `remoteTiketId`, verificar si proviene de un canal asociado a `tiketid`
                ticket = await admin.findOne({ tiketid: message.channel.id });
                console.log("2");
                console.log(ticket);

                if (ticket) {
                    destinationChannelId = ticket.remoteTiketId;
                    console.log(destinationChannelId);

                                    messageToSend = `${message.author.tag}: ${messageContent}`;// Canal opuesto

                }
            }

            // Si no se encontró un ticket asociado, salir
            if (!ticket) {
                console.log(
                    "No se encontró un ticket relacionado con este canal."
                );
                return;
            }

            // Validar formato del mensaje

            // Crear el mensaje a enviar al canal opuesto

            // Obtener el canal de destino
            if(ticket.status !== "open"){
                return;
            }
            const destinationChannel = await client.channels.fetch(
                destinationChannelId
            );

            if (destinationChannel) {
                // Enviar el mensaje al canal opuesto
                await destinationChannel.send(messageToSend);
            } else {
                console.log("No se encontró el canal de destino.");
            }
        } catch (error) {
            console.error("Error al procesar el mensaje:", error);
        }
    }
}

module.exports = TicketCom;
const Client = require("@client");
const { Buttons } = require("@models");
const {
    ButtonInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ButtonBuilder,
    CacheType,
} = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const regp = require('./../../../../mongodb/models/problemaS');
const config = require('../../../../cnf/config.json');

class Example extends Buttons {
    constructor() {
        super("cerrartks");
    }

    async run(client, int) {
        const preguntaId = int.message.embeds[0].footer.text.slice(11);
        const data = await regp.findById(preguntaId);

        if (!data) {
            return int.reply({
                content: "❌ *Oh, parece que el ticket se esfumó como un sueño olvidado... No se encontró la información. ¿Intentaste no romper el sistema?*",
                ephemeral: true,
            });
        }

        const ticketChannel = int.channel; // Canal donde se ejecutó el botón

        try {
            // Eliminar el ticket de la base de datos
            await regp.findByIdAndDelete(preguntaId);

            // Notificar al usuario antes de eliminar el canal
            await int.reply({
                content: "✅ *El ticket será cerrado y el canal se eliminará en 10 segundos.*",
            });

            // Esperar 10 segundos antes de eliminar el canal
            setTimeout(async () => {
                if (ticketChannel) {
                    await ticketChannel.delete(
                        `Ticket cerrado por ${int.user.tag}`
                    );
                }
            }, 10000); // 10 segundos en milisegundos
        } catch (error) {
            console.error("Error al cerrar el ticket:", error);

            return int.reply({
                content: "❌ *Hubo un problema al intentar cerrar el ticket. Por favor, inténtalo de nuevo más tarde.*",
                ephemeral: true,
            });
        }
    }
}

module.exports = Example;

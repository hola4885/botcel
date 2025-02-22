const { SlashCommands } = require("@models");
const { Client, CommandInteraction, EmbedBuilder, ChannelType, channelMention } = require("discord.js");

/**
 * Clase para representar el comando slash de anuncio.
 * @extends SlashCommands
 */
class Anuncio extends SlashCommands {
    constructor(){
        super({
            name: "anuncio",
            description: "Manda un anuncio a un canal.",
            options: [
                {
                    type: 7, // CHANNEL type
                    name: 'canal',
                    description: 'Canal donde se enviará el anuncio.',
                    required: true,
                },
                {
                    type: 3, // STRING type
                    name: 'titulo',
                    description: 'Coloca el título al anuncio.',
                    required: true,
                },
                {
                    type: 3, // STRING type
                    name: 'description',
                    description: 'Envía el contenido del anuncio.',
                    required: true,
                },
                {
                    type: 5, // BOOLEAN type
                    name: 'ping',
                    description: 'Informa si quieres enviar un ping al canal del anuncio.',
                    required: true,
                }
            ]
        });
    }

 /**
     * Ejecuta la lógica asociada al comando slash.
     * @param {Client} client - El cliente Discord.js.
     * @param {CommandInteraction<CacheType>} int - La interacción del comando slash.
     */
 async run(client, int) {
        try {
            const channel = int.options.getChannel('canal');
            const title = int.options.getString('titulo');
            const desc = int.options.getString('description');
            const ping = int.options.getBoolean('ping');

            if (channel.type !== ChannelType.GuildText) {
                return int.reply({ content: 'Por favor selecciona un canal de texto válido.', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setTitle(title)
                .setColor("#16FFF0")
                .setTimestamp()
                .setFooter({ text: `Anuncio de ${int.user.tag}`, iconURL: int.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(desc);

            await channel.send({ embeds: [embed], fetchReply: true });

            if (ping) {
                await channel.send({ content: '@everyone' });
            }

            return int.reply({ content: "✅ Mensaje enviado", ephemeral: true });
        } catch (error) {
            console.error("Error enviando anuncio:", error);
            return int.reply({ content: "Ocurrió un error al enviar el anuncio. Por favor intenta nuevamente.", ephemeral: true });
        }
    }
}

module.exports = Anuncio;

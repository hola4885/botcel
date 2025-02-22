const { SlashCommands } = require("@models");
const { Client, CommandInteraction, EmbedBuilder, ChannelType, channelMention } = require("discord.js");
const schema = require('../../../../../mongodb/models/join-to-create')
/**
 * Clase para representar el comando slash de anuncio.
 * @extends SlashCommands
 */
class Unete extends SlashCommands {
    constructor(){
        super({
            name: "upc",
            description: "Unete para crear.",
       
        });
    }
 /**
     * Ejecuta la lógica asociada al comando slash.
     * @param {Client} client - El cliente Discord.js.
     * @param {CommandInteraction<CacheType>} int - La interacción del comando slash.
     */
 async run(client, int) {
        try {
                const channel = int.member.voice.channelId;
        if (!channel) return int.reply(`**${int.member}** Únete a un canal de voz para convertirlo en un canal de "unirse para crear".`);

        let data = await schema.findOne({ Guild: int.guild.id });
        if (!data) {
            data = new schema({
                Guild: int.guild.id,
                Channel: channel
            });
            await data.save();
        } else {
            data.Channel = channel;
            await data.save();
        }

        int.reply({
            content: `<#${channel}> se ha establecido como el canal de "unirse para crear".`
        });
    
        } catch (error) {
            console.error("Error enviando anuncio:", error);
            return int.reply({ content: "Ocurrió un error al enviar el anuncio. Por favor intenta nuevamente.", ephemeral: true });
        }
    }
}

module.exports = Unete;

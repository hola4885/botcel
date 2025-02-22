const { SlashCommands } = require("@models");
const { Client,ActionRowBuilder, CommandInteraction,ButtonBuilder, EmbedBuilder, ChannelType, channelMention } = require("discord.js");

/**
 * Clase para representar el comando slash de Avatar.
 * @extends SlashCommands
 */
class Avatar extends SlashCommands {
    constructor(){
        super({
            name: "avatar",
            description: "Muestra el avatar d el usuario.",
            options: [
                {
                    type: 6, // USER type
                    name: 'user',
                    description: 'Menciona al usuario al que está dirigido el anuncio.',
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
            const user = int.options.getUser('user')
            const embed = new EmbedBuilder()
            .setTitle(`Avatar de:${user.tag}`)
            .setImage(user.displayAvatarURL({ size: 4096 }))
            .setColor('#16FFF0')
            .setTimestamp();
    
            const formats = ['png', 'jpg', 'jpeg', 'gif'];
            const components = [];
            formats.forEach(format => {
                let imageOptions = { extension: format, forceStatic: format == 'gif' ? false : true };
    
                if (user.avatar == null && format !== 'png') return; 
                if (!user.avatar.startsWith('a_') && format === 'gif') return;
                components.push(
                    new ButtonBuilder()
                    .setLabel(format.toUpperCase())
                    .setStyle('Link')
                    .setURL(user.displayAvatarURL(imageOptions))
                )
            })
    
            const row = new ActionRowBuilder()
            .addComponents(components);
    
            return int.reply({ embeds: [embed], components: [row] })
        } catch (error) {
            console.error("Error enviando anuncio:", error);
            return int.reply({ content: "Ocurrió un error al enviar el anuncio. Por favor intenta nuevamente.", ephemeral: true });
        }
    }
}

module.exports = Avatar;

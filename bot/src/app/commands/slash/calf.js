const { SlashCommands } = require("@models");
const { Client, EmbedBuilder, ChannelType } = require("discord.js");
const configs = require('../../../../cnf/config.json');

/**
 * Clase para representar el comando slash de valoración.
 * @extends SlashCommands
 */
class Valorar extends SlashCommands {
    constructor(){
        super({
            name: "calificar",
            description: 'Envía una reseña para el bot.',
            options: [
                {
                    type: 3, // STRING type
                    name: 'reseña',
                    description: 'Escribe tu reseña',
                    required: true,
                },
                {
                    type: 3, // STRING type
                    name: 'estrellas',
                    description: '¿Cuántas estrellas le das?',
                    required: true,
                    choices: [
                        { name: '⭐', value: '⭐⠀⠀⠀⠀' },
                        { name: '⭐⭐', value: '⭐⭐⠀⠀⠀' },
                        { name: '⭐⭐⭐', value: '⭐⭐⭐⠀⠀' },
                        { name: '⭐⭐⭐⭐', value: '⭐⭐⭐⭐⠀' },
                        { name: '⭐⭐⭐⭐⭐', value: '⭐⭐⭐⭐⭐' },
                    ],
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
            const reseña = int.options.getString('reseña');
            const estrellas = int.options.getString('estrellas');

            const embed = new EmbedBuilder()
            .setTitle("✨ | Valoración Recibida")
            .setDescription(`**¡Gracias por tu valoración!**\n\n**Reseña:**\n${reseña}`)
            .addFields(
                { name: "⭐ Calificación", value: `${estrellas}`, inline: true },
                { name: "🔗 Usuario", value: `<@${int.user.id}>`, inline: true }
            )
            .setColor("#FFD700")
            .setThumbnail(int.user.displayAvatarURL({ dynamic: true }))
            .setImage('https://cdn.discordapp.com/attachments/1126553811788501133/1277147747602010153/4bfbff9c-bdd9-4ca5-90a5-72c5116e4ac2.png?ex=66cf67c7&is=66ce1647&hm=9308ffeed2a794f4283e0d68283b04918813a45d8150cc45897c78f4bbfc2063&=&format=webp&quality=lossless&width=1020&height=232')  // Agregar imagen

            .setFooter({ text: `Reseña enviada por ${int.user.tag}`, iconURL: int.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

            // Canal donde se enviará la reseña
            const channel = client.channels.cache.get('1277806521173934141');
            if (channel && channel.type === ChannelType.GuildText) {
                await channel.send({ embeds: [embed], fetchReply: true });
            } else {
                return int.reply({ content: 'No se pudo encontrar el canal de reseñas.', ephemeral: true });
            }

            int.reply({ content: "✅ Tu reseña fue enviada correctamente.", ephemeral: true });
        } catch (error) {
            console.error("Error enviando la reseña:", error);
            int.reply({ content: "Ocurrió un error al enviar tu reseña. Por favor intenta nuevamente.", ephemeral: true });
        }
    }
}

module.exports = Valorar;

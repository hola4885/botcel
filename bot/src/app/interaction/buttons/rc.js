const { Client } = require("@client");
const { Buttons } = require("@models");
const { ButtonInteraction, CacheType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

/**
 * Clase para representar un ejemplo de botón interactivo con restricciones de rol.
 * @extends Buttons
 */
class Example extends Buttons {
    constructor(){
        super("reclamar");
        this.allowedRoleId = "1328833073558851646"; // Reemplaza con el ID del rol permitido
    }

    /**
     * Ejecuta la lógica asociada al botón interactivo con restricciones.
     * @param {Client} client - El cliente Discord.js.
     * @param {ButtonInteraction<CacheType>} int - La interacción del botón.
     */
    async run(client, int) {
        if (!int.isButton()) return;
        const user = int.user;
        const member = await int.guild.members.fetch(user.id);

        // Verificar si el usuario tiene el rol permitido
        if (!member.roles.cache.has(this.allowedRoleId)) {
            return int.reply({ content: "❌ No tienes permiso para reclamar este reporte.", ephemeral: true });
        }

        // Obtener el embed actual
        const embed = EmbedBuilder.from(int.message.embeds[0]);
        embed.setColor("#00FF00") // Cambia el color a verde
            .addFields(
                { name: "Estado", value: "Reclamado" },
                { name: "reclamado por:", value: `${user.tag}` }
            )
            .setFooter({ text: `Reclamado por: ${user.id}` }); // Guarda el ID del usuario en el footer

        // Definir los nuevos botones
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('accept').setLabel('✅ Aceptar').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('release').setLabel('🔄 Liberar').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('deny').setLabel('❌ Denegar').setStyle(ButtonStyle.Danger)
        );
       

        // Editar el mensaje con el embed modificado y los nuevos botones
        await int.update({ embeds: [embed], components: [buttons] });
    }
}

module.exports = Example;
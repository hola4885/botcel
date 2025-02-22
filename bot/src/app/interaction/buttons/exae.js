const { ButtonInteraction, CacheType } = require("discord.js");
const { Buttons } = require("@models");
const {   ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

/**
 * Clase para manejar el botón "Aceptar" con restricciones.
 * @extends Buttons
 */
class AcceptButton extends Buttons {
    constructor() {
        super("accept");
    }

    async run(client, interaction) {
        const user = interaction.user;
        const embed = EmbedBuilder.from(interaction.message.embeds[0]);

        // Obtener el ID del usuario que reclamó desde el footer
        const footerText = embed.data.footer.text;
        const claimedUserId = footerText.split(': ')[1];

        // Evitar que cualquier otro usuario que no sea el reclamante interactúe
        if (user.id !== claimedUserId) {
            return interaction.reply({ content: "❌ Solo el usuario que reclamó este reporte puede aceptarlo.", ephemeral: true });
        }

        embed.setColor("#64d208")
            .addFields({ name: "`El reporte ha sido aceptado por el staff:", value: `${user.tag}`, inline: true });
        // Definir los nuevos botones
     
        // Editar el mensaje con el embed modificado y los nuevos botones
        await interaction.update({
            content: `El reporte ha sido aceptado por el staff: ${user.tag}`,
            embeds: [embed],
            components: []
        });

        const usuarioId = interaction.message.embeds[0].fields.find(field => field.name === '🆔 Usuario').value;
        const dmUser = await client.users.fetch(usuarioId);

        await dmUser.send({
            content: `Tu reporte en **Astroverse** ha sido aceptado por el staff: ${user.tag}.`
        });
    }
}

module.exports = AcceptButton;
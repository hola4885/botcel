const { ButtonInteraction, CacheType } = require("discord.js");
const { Buttons } = require("@models");
const { AnySelectMenuInteraction,Events,EmbedBuilder, ModalBuilder,ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

/**
 * Clase para manejar el botón "Denegar".
 * @extends Buttons
 */
class DenyButton extends Buttons {
    constructor() {
        super("deny");
    }

    /**
     * Ejecuta la lógica asociada al botón interactivo "Denegar".
     * @param {Client} client - El cliente Discord.js.
     * @param {ButtonInteraction<CacheType>} interaction - La interacción del botón.
     */
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

        // Crear el modal para ingresar la razón
        const modal = new ModalBuilder()
              .setCustomId('denyModal')
              .setTitle('📝 Motivo para Denegar');
        
           
         
                   const asuntoInput =   new TextInputBuilder()
                        .setCustomId('denyReason')
                        .setLabel('Razón para denegar')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                        .setMaxLength(1000)
                
  modal.addComponents(
              new ActionRowBuilder().addComponents(asuntoInput));
        // Mostrar el modal al staff
        await interaction.showModal(modal);
    }
}

module.exports = DenyButton
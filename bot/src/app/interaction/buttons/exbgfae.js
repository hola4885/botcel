const { Buttons } = require("@models");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

/**
 * Clase para manejar el botón "Liberar".
 * @extends Buttons
 */
class ReleaseButton extends Buttons {
    constructor() {
        super("release");
    }

    async run(client, interaction) {
        try {
            const user = interaction.user;

            // Verifica que haya un embed en el mensaje
            if (!interaction.message.embeds || interaction.message.embeds.length === 0) {
                return interaction.reply({
                    content: "❌ No se encontró un embed en este mensaje.",
                    ephemeral: true
                });
            }

            const embed = EmbedBuilder.from(interaction.message.embeds[0]);

            // Verifica que el footer exista
            if (!embed.data.footer || !embed.data.footer.text) {
                return interaction.reply({
                    content: "❌ No se encontró información en el pie del mensaje.",
                    ephemeral: true
                });
            }

            // Obtener el ID del usuario que reclamó desde el footer
            const footerText = embed.data.footer.text;
            const claimedUserId = footerText.split(": ")[1];

            // Evitar que cualquier otro usuario interactúe
            if (user.id !== claimedUserId) {
                return interaction.reply({
                    content: "❌ Solo el usuario que reclamó este reporte puede aceptarlo.",
                    ephemeral: true
                });
            }

            // Modificar el embed: actualizar el campo específico
            if (embed.data.fields) {
                const fields = embed.data.fields;

                // Incrementar el número en el 6to campo (si existe)
                if (fields[5]) {
                    const originalValue = parseInt(fields[5].value, 10) || 0;
                    fields[5].value = (originalValue + 1).toString();
                }

                // Eliminar los últimos 2 campos, si existen
                if (fields.length >= 2) {
                    embed.spliceFields(fields.length - 2, 2);
                }
            }

            embed.addFields({ name: "Estado", value: "pendiente" });

            const buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("reclamar")
                    .setLabel("✅ Reclamar")
                    .setStyle(ButtonStyle.Success)
            );

            // Actualizar el mensaje
            await interaction.update({
                content: "🔄 El reporte ha sido liberado.",
                embeds: [embed],
                components: [buttons]
            });

            // Enviar mensaje privado al usuario original
            const usuarioField = embed.data.fields.find(field => field.name === "👤 Nick");
            if (usuarioField) {
                const usuarioId = usuarioField.value;

                // Validar que el ID sea un Snowflake (numérico)
                if (!/^\d+$/.test(usuarioId)) {
                    console.error(`El ID de usuario no es válido: ${usuarioId}`);
                    return;
                }

                const dmUser = await client.users.fetch(usuarioId);

                await dmUser.send({
                    content: `Tu reporte en **Astroverse** ha sido liberado por el staff: ${user.tag}.`
                });
            }
        } catch (error) {
            console.error("Error en el botón 'release':", error);
            if (!interaction.replied) {
                await interaction.reply({
                    content: "❌ Ocurrió un error al procesar tu interacción.",
                    ephemeral: true
                });
            }
        }
    }
}

module.exports = ReleaseButton;
const Client = require("@client");
const { ModalSubmit } = require("@models");
const { CacheType, ModalSubmitInteraction, EmbedBuilder } = require("discord.js");

/**
 * Clase para representar un ejemplo de modal de presentación.
 * @extends ModalSubmit
 */
class Examplse extends ModalSubmit {
    constructor() {
        super("cnv");
    }

    /**
     * Ejecuta la lógica asociada al modal de presentación.
     * @param {Client} client - El cliente Discord.js.
     * @param {ModalSubmitInteraction<CacheType>} int - La interacción del modal de presentación.
     * @param {Object} data - Datos adicionales (opcional).
     */
    async run(client, int, data = {}) {
        const asunto = int.fields.getTextInputValue("cargo"); // Cargo introducido
        const descripcion = int.fields.getTextInputValue("nombre"); // Nombre introducido
        const auth = int.user.id; // ID del usuario que envió el modal

        // ID del rol que deseas etiquetar
        const roleId = "1328856034197901352";

        // Crear el embed con los datos del modal
        const embed = new EmbedBuilder()
            .setTitle("📋 Información Recibida")
            .setDescription(
                "🎭 **Verificación**: Bueno, bueno, parece que alguien tiene algo importante que decir... Veamos si cumple con los estándares básicos de humanidad."
            )
            .addFields(
                { name: "👤 **Nombre**", value: `${descripcion || "¿Un misterio, eh?"}`, inline: true },
                { name: "🖋️ **Cargo**", value: `${asunto || "¿Tanta prisa que ni escribiste esto?"}`, inline: true },
                { name: "🔗 **Enviado por**", value: `<@${auth}> (Sí, tú mismo. No disimules.)`, inline: true }
            )
            .setColor(0x1e90ff) // Color azul
            .setTimestamp()
            .setImage(
                "https://media.discordapp.net/attachments/1330691603698024488/1331428229424087040/Verificar.png?ex=679194aa&is=6790432a&hm=0c6c68d4b36c616037fafb983c15965bebfa3af056cc6d35a8e042e0ae66c8e4&=&format=webp&quality=lossless&width=1025&height=270"
            )
            .setFooter({
                text: "✨ Felicidades por completar algo sin equivocarte... creo.",
                iconURL: client.user.displayAvatarURL(),
            });

        // Enviar mensaje etiquetando el rol y mostrando el embed
        const channel = int.channel; // Canal donde se ejecuta la interacción
        await channel.send({
            content: `<@&${roleId}> 🛑 ¡Atención equipo! Un nuevo formulario ha llegado para perturbar la paz.`,
            embeds: [embed],
        });

        // Responder al usuario
        await int.reply({
            content:
                "✅ *Bueno, al menos lograste enviar esto... aunque no esperes una ovación.*\nTu formulario está en la fila. No te emociones demasiado.",
            ephemeral: true,
        });
    }
}

module.exports = Examplse;

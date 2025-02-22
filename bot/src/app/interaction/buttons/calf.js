const {
  ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  CacheType,
} = require("discord.js");
const Client = require("@client");
const { Buttons } = require("@models");
const regp = require("./../../../../../mongodb/models/problemaA");

/**
 * Clase para representar un ejemplo de botón interactivo.
 * @extends Buttons
 */
class Example extends Buttons {
  constructor() {
    super("calf"); // ID del botón
  }

  /**
   * Ejecuta la lógica asociada al botón interactivo.
   * @param {Client} client - El cliente Discord.js.
   * @param {ButtonInteraction<CacheType>} int - La interacción del botón.
   */
  async run(client, int, data = {}) {
    try {
          const preguntaId = int.message.embeds[0].footer.text.slice(15);
      const pregunta = await regp.findById(preguntaId);
          if (int.member.id !== pregunta.author) {
        return int.reply({
          content: "🚫 **Solo el usuario puede calificar el ticket.**",
          ephemeral: true,
        });
      }
      // Crear el modal
      const modal = new ModalBuilder()
        .setCustomId("valor")
        .setTitle("Comentario y Calificación");

      // Campo para comentarios
      const commentInput = new TextInputBuilder()
        .setCustomId("comentarios")
        .setLabel("Escribe tu comentario")
        .setPlaceholder("Detalles adicionales")
        .setStyle(TextInputStyle.Paragraph) // Campo multilínea
        .setRequired(true);

      // Campo para calificación (número)
      const ratingInput = new TextInputBuilder()
        .setCustomId("calificacion")
        .setLabel("Ingresa una calificación (1-5)")
        .setPlaceholder("Escribe un número del 1 al 5")
        .setStyle(TextInputStyle.Short) // Campo de una sola línea
        .setRequired(true);

      // Agregar elementos al modal
      modal.addComponents(
        new ActionRowBuilder().addComponents(commentInput),
        new ActionRowBuilder().addComponents(ratingInput)
      );

      // Mostrar el modal al usuario
      await int.showModal(modal);
    } catch (err) {
      console.error("Error al mostrar el modal:", err);
    }
  }
}

module.exports = Example;
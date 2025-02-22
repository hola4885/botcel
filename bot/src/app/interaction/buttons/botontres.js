const Client = require("@client");
const { Buttons } = require("@models");
const { ButtonInteraction, CacheType } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

/**
 * Clase para representar un ejemplo de botón interactivo.
 * @extends Buttons
 */
class Example extends Buttons {
  constructor() {
    super("resolve");
  }

  /**
   * Ejecuta la lógica asociada al botón interactivo.
   * @param {Client} client - El cliente Discord.js.
   * @param {ButtonInteraction<CacheType>} int - La interacción del botón.
   */
  async run(client, int) {
    try {
      const ticketId = int.message.embeds[0]?.footer?.text?.slice(3); // Asume que el ID del ticket está en el footer
      if (!ticketId) {
        return int.reply({ content: "❌ No se pudo encontrar el ID del ticket.", ephemeral: true });
      }

      const ticketData = await db.get(`ticket_${ticketId}`);

      if (!ticketData) {
        return int.reply({ content: "❌ El ticket no existe.", ephemeral: true });
      }

      // Cambiar el estado del ticket a resuelto
      await db.set(`ticket_${ticketId}.status`, "resolved");

      return int.reply({ content: "✅ El ticket ha sido marcado como resuelto.", ephemeral: true });
    } catch (error) {
      console.error("Error al resolver el ticket:", error);
      return int.reply({
        content: "❌ Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.",
        ephemeral: true,
      });
    }
  }
}

module.exports = Example;
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageDelete", // Nombre del evento
  once: false, // Si debe ejecutarse solo una vez
  execute: async (message, client) => {
    try {
      // Verificar que el mensaje no sea de un bot
      if (!message || message.author?.bot) return;

      // IDs de los servidores permitidos
      const allowedServer1Id = "132858155077120081";
      const allowedServer2Id = "1245743198957998112";

      // Verificar si el evento ocurrió en un servidor permitido
      if (
        message.guild.id !== allowedServer1Id &&
        message.guild.id !== allowedServer2Id
      ) {
        return console.log(
          `Evento ignorado. Servidor no permitido: ${message.guild.name} (${message.guild.id})`
        );
      }

      // Obtener el canal de logs
      const logChannel = client.channels.cache.get("1281811337747501119");
      if (!logChannel) {
        return console.error("Canal de logs no encontrado.");
      }

      // Formato de autor: @usuario (nombre_de_usuario)
      const authorDisplay = `<@${message.author.id}> (${message.author.username})`;

      // Obtener información sobre quién eliminó el mensaje
      const fetchedLogs = await message.guild.fetchAuditLogs({
        limit: 1,
        type: "MESSAGE_DELETE",
      });
      const deletionLog = fetchedLogs.entries.first();
      const deleter = deletionLog?.executor;

      // Formato de quien eliminó el mensaje: @usuario (nombre_de_usuario)
      const deleterDisplay = deleter ? `<@${deleter.id}> (${deleter.username})` : "Desconocido";

      // Obtener información sobre el mensaje al que respondía
      let repliedToContent = "No era una respuesta";
      let repliedToLink = "";
      if (message.reference) {
        const repliedToMessage = await message.channel.messages.fetch(message.reference.messageId);
        repliedToContent = repliedToMessage.content || "*Mensaje vacío*";
        repliedToLink = `[Enlace al mensaje](${repliedToMessage.url})`;
      }

      // Crear el embed
      const embed = new EmbedBuilder()
        .setTitle("🛑 Mensaje Eliminado 🛑")
        .setColor("#ff0000")
        .addFields(
          { name: "📨 Autor:", value: authorDisplay, inline: false },
          { name: "🛠️ Eliminado por:", value: deleterDisplay, inline: false },
          { name: "💬 Contenido:", value: message.content || "*Mensaje vacío*", inline: false },
          { name: "📍 Canal:", value: `${message.channel} (${message.channel.id})`, inline: false },
          { name: "📅 Fecha de creación:", value: message.createdAt.toUTCString(), inline: false },
          { name: "🔄 Respuesta a:", value: repliedToContent, inline: false },
          { name: "🔗 Enlace al mensaje:", value: repliedToLink || "No aplica", inline: false }
        )
        .setFooter({ text: `ID del Mensaje: ${message.id}` })
        .setTimestamp();

      // Enviar el embed al canal de logs
      logChannel.send({ embeds: [embed] });
    } catch (error) {
      console.error("Error al manejar mensaje eliminado:", error);
    }
  },
};
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageUpdate",
  once: false,
  execute: async (oldMessage, newMessage, client) => {
    try {
      // Verificar que el mensaje no sea de un bot
      if (!newMessage || newMessage.author?.bot) return;

      // Manejar mensajes no cacheados
      if (!oldMessage.content) {
        oldMessage = await newMessage.fetch(); // Obtener el mensaje completo si no está en caché
      }

      // Verificar si el contenido del mensaje ha cambiado
      if (oldMessage.content === newMessage.content) return;

      // IDs de los servidores permitidos
      const allowedServer1Id = "124574319895799811";
      const allowedServer2Id = "1245743198957998112";

      // Verificar si el evento ocurrió en un servidor permitido
      if (
        newMessage.guild.id !== allowedServer1Id &&
        newMessage.guild.id !== allowedServer2Id
      ) {
        return console.log(
          `Evento ignorado. Servidor no permitido: ${newMessage.guild.name} (${newMessage.guild.id})`
        );
      }

      // Obtener el canal de logs
      const logChannel = client.channels.cache.get("1281811337747501119");
      if (!logChannel) {
        return console.error("Canal de logs no encontrado.");
      }

      // Formato de autor con mención y nombre
      const authorDisplay = `<@${newMessage.author.id}> (${newMessage.author.username})`;

      // Crear el embed
      const embed = new EmbedBuilder()
        .setTitle("✏️ Mensaje Editado")
        .setColor("#ffa500")
        .addFields(
          { name: "📨 Autor:", value: authorDisplay, inline: false },
          { name: "📜 Canal:", value: `${newMessage.channel} (${newMessage.channel.id})`, inline: false },
          { name: "✏️ Mensaje Original:", value: oldMessage.content || "*Mensaje vacío*", inline: false },
          { name: "📝 Mensaje Editado:", value: newMessage.content || "*Mensaje vacío*", inline: false }
        )
        .setFooter({ text: `ID del Mensaje: ${newMessage.id}` })
        .setTimestamp();

      // Enviar el embed al canal de logs
      logChannel.send({ embeds: [embed] });
    } catch (error) {
      console.error("Error al manejar mensaje editado:", error);
    }
  },
};
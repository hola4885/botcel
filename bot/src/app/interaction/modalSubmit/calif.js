const { ModalSubmit } = require("@models");
const { EmbedBuilder, ActionRowBuilder, TextInputStyle, ModalBuilder } = require("discord.js");
const regp = require("./../../../../../mongodb/models/problemaA");

class Example extends ModalSubmit {
  constructor() {
    super("valor");
  }

  async run(client, int, data = {}) {
    try {
      // Obtener ID del ticket desde el mensaje
      const preguntaId = int.message.embeds[0].footer.text.slice(15);
      const pregunta = await regp.findById(preguntaId);

      // Obtener la calificación y comentario del modal
      const calificacion = int.fields.getTextInputValue("calificacion");
      const comentario = int.fields.getTextInputValue("comentarios");

      // Validación de calificación
      if (isNaN(calificacion) || calificacion < 1 || calificacion > 5) {
        return int.reply({
          content: "❌ *¿En serio? La calificación está entre 1 y 5... no hace falta ser Einstein para entenderlo.*",
          ephemeral: true,
        });
      }

      // Crear el embed de agradecimiento por la calificación
      const calificacionEmbed = new EmbedBuilder()
        .setColor("#1E90FF")
        .setTitle("🎉 ¡Gracias por tu calificación, supongo!")
        .setDescription(
          `**Tu calificación:** ${calificacion}/5 ⭐\n\n` +
          `*Esperamos que este glorioso feedback nos ayude... o algo así. Al menos lo intentamos.*`
        )
        .setThumbnail("https://media.discordapp.net/attachments/1330691603698024488/1331427816784269383/Doradito.png?ex=67919448&is=679042c8&hm=2a4e99264f645e6ca4821c934d7c329ffd9053c79f72d0d6801fa2b50031ece6&=&format=webp&quality=lossless&width=1025&height=269") // Imagínate que pongas una imagen graciosa aquí
        .setFooter({ text: "¡Nos ayuda... o no?", iconURL: int.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

      // Responder al usuario con la calificación
      await int.reply({ embeds: [calificacionEmbed] });

      // Crear un embed con los detalles de la reseña
      const reseñaEmbed = new EmbedBuilder()
        .setTitle("|Ticket| ¡Una nueva reseña, qué emocionante!")
        .setColor("#FF6347")
        .setDescription("🔍 *Otra reseña se agrega a la lista... nada de qué presumir, pero bueno.*")
        .addFields(
          { name: "👨‍💻 **Staff Involucrado**", value: `<@${pregunta.staff}>`, inline: true },
          { name: "📝 **Comentario**", value: comentario || "*El silencio también puede ser una respuesta... aunque no muy útil.*", inline: false },
          { name: "⭐ **Calificación**", value: `${calificacion}/5`, inline: true }
        )
        .setFooter({ text: `Reseña de ${int.user.tag}`, iconURL: int.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp()
        .setImage("https://media.discordapp.net/attachments/1080699190797139998/1331420608747274400/Imagen_de_WhatsApp_2025-01-21_a_las_16.56.31_4a9b8b7c2.jpg?ex=67918d91&is=67903c11&hm=54929c912b90b9980abb1f5c2b343cfb391e5fddcca6ac24d4f002468714475b&=&format=webp&width=720&height=468"); // Imagen relacionada con la reseña, para hacerlo visualmente más interesante

      // Enviar la reseña al canal de reseñas
      const reseñaChannel = client.channels.cache.get("1331446898116137083"); // Canal de reseñas
      await reseñaChannel.send({
        content: "*Otra reseña se agrega a la lista... nada de qué presumir, pero bueno.*",
        embeds: [reseñaEmbed],
      });

      // Obtener los IDs de los canales del ticket desde `data`
      const ticketChannelId = data.ticketId; // ID del primer canal
      const remoteTicketChannelId = data.remoteTicketId; // ID del segundo canal

      // Función para eliminar el canal después de un tiempo
      const eliminarCanalDespuesDeTiempo = (canalId, guildId, tiempoEnSegundos) => {
        setTimeout(async () => {
          const guild = client.guilds.cache.get(guildId); // ID del servidor
          const canal = await guild.channels.fetch(canalId);
          if (canal) {
            await canal.delete()
              .then(() => {
                console.log(`✔️ Canal ${canalId} eliminado con éxito... o no. Quién sabe.`);
              })
              .catch((error) => {
                console.error(`❌ Error al eliminar el canal ${canalId}:`, error);
              });
          } else {
            console.log(`🔍 *El canal ${canalId} parece haberse desvanecido... ni modo.*`);
          }
        }, tiempoEnSegundos * 1000); // El tiempo en segundos convertido a milisegundos
      };

      // Eliminar el primer canal del ticket después de X segundos (por ejemplo, 10 segundos)
      if (ticketChannelId) {
        eliminarCanalDespuesDeTiempo(ticketChannelId, "1245743198957998112", 10); // 10 segundos
      }

      // Eliminar el segundo canal remoto del ticket después de X segundos (por ejemplo, 10 segundos)
      if (remoteTicketChannelId) {
        eliminarCanalDespuesDeTiempo(remoteTicketChannelId, "1328581555077120081", 10); // 10 segundos
      }

    } catch (error) {
      console.error("❌ Error al procesar la interacción:", error);
      return int.reply({
        content: "❌ *Ups... parece que algo salió mal, pero claro, nada es culpa nuestra. ¡Qué sorpresa!*",
        ephemeral: true,
      });
    }
  }
}

module.exports = Example;

const { Buttons } = require("@models");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
} = require("discord.js");
const regp = require("./../../../../../mongodb/models/problemaA");

class Example extends Buttons {
  constructor() {
    super("claim");
  }

  async run(client, int) {
    try {
      const preguntaId = int.message.embeds[0].footer.text.slice(15); // Extraer ID del ticket
      const pregunta = await regp.findById(preguntaId);

      if (!pregunta) {
        return int.reply({
          content: "❌ **No se encontró información sobre este ticket.**",
          ephemeral: true,
        });
      }

      if (int.member.id === pregunta.author) {
        return int.reply({
          content: "🚫 **Solo los miembros del staff pueden reclamar el ticket.**",
          ephemeral: true,
        });
      }
 
      const user = await client.users.fetch(pregunta.author); // Usuario que abrió el ticket
      const userChannel = await client.channels.fetch(pregunta.tiketid);
      const staffChannel = await client.channels.fetch(pregunta.remoteTiketId);

      const guild = client.guilds.cache.get(int.guild.id);
      const everyone = guild.roles.everyone;
if (!pregunta.author || !int.member.id || !everyone.id) {
  return int.reply({
    content: "❌ **No se pudieron obtener los IDs necesarios para ajustar los permisos.**",
    ephemeral: true,
  });
}
    const remoteGuildId = "1245743198957998112"; // ID del servidor remoto

    const remoteGuild = client.guilds.cache.get(remoteGuildId);

      // Ajustar permisos en el canal del usuario
      await userChannel.permissionOverwrites.set([
              {
          id: remoteGuild.roles.everyone.id,
          deny: ["ViewChannel"],
        },
        {
          
          id: pregunta.author, // Usuario que abrió el ticket
          allow: ["ViewChannel", "SendMessages"],
        }
      ]);

      // Ajustar permisos en el canal del staff
      await staffChannel.permissionOverwrites.set([
        {
          id: int.member.id, // Staff que reclamó el ticket
          allow: ["ViewChannel", "SendMessages"],
        },
        {
          id: everyone.id,
          deny: ["ViewChannel"],
        },
      ]);

      // Botón para cerrar el ticket
      const closeButton = new ButtonBuilder()
        .setCustomId("cerrar_ticket")
        .setLabel("Cerrar Ticket")
        .setEmoji("🔒")
        .setStyle(ButtonStyle.Danger);

      const actionRow = new ActionRowBuilder().addComponents(closeButton);

      // Obtener el mensaje original del canal del usuario
      const userMessage = await userChannel.messages.fetch(pregunta.localMessageId);
      const userEmbed = userMessage.embeds[0];
      if (!userEmbed) {
        return int.reply({
          content: "❌ **No se pudo encontrar el embed original en el canal del usuario.**",
          ephemeral: true,
        });
      }

      // Editar el embed del canal del usuario
      const updatedUserEmbed = EmbedBuilder.from(userEmbed)
        .addFields(
          { name: "👨‍💻 Staff Responsable", value: `<@${int.member.id}>`, inline: true }
        )
        .setColor(0x00ae86)
        .setImage("https://media.discordapp.net/attachments/1330691603698024488/1331427816784269383/Doradito.png?ex=67919448&is=679042c8&hm=2a4e99264f645e6ca4821c934d7c329ffd9053c79f72d0d6801fa2b50031ece6&=&format=webp&quality=lossless&width=1025&height=269") // Sustituye con el logo de Celunyx

        .setFooter({ text: `ID del Ticket: ${preguntaId}` })
        .setTimestamp();

      await userMessage.edit({
        content: `El ticket ah sido reclamado <@${pregunta.author}>`,
        embeds: [updatedUserEmbed],
      });

      // Obtener el mensaje original del canal del staff
      const staffMessage = await staffChannel.messages.fetch(pregunta.remoteMessageId);
      const staffEmbed = staffMessage.embeds[0];
      if (!staffEmbed) {
        return int.reply({
          content: "❌ **No se pudo encontrar el embed original en el canal del staff.**",
          ephemeral: true,
        });
      }
      pregunta.staff = int.user.id;
      pregunta.staff = "open";

      await pregunta.save();
      // Editar el embed del canal del staff
      const updatedStaffEmbed = EmbedBuilder.from(staffEmbed)
        .addFields(
          { name: "👨‍💻 Staff Responsable", value: `<@${int.member.id}>`, inline: true }
        )
        .setImage("https://media.discordapp.net/attachments/1330691603698024488/1331427816784269383/Doradito.png?ex=67919448&is=679042c8&hm=2a4e99264f645e6ca4821c934d7c329ffd9053c79f72d0d6801fa2b50031ece6&=&format=webp&quality=lossless&width=1025&height=269") // Sustituye con el logo de Celunyx
        .setColor(0x7289da)
        .setFooter({ text: `ID del Ticket: ${preguntaId}` })
        .setTimestamp();

      await staffMessage.edit({
        embeds: [updatedStaffEmbed],
        components: [actionRow],
      });

      // Confirmar acción al usuario que reclamó el ticket
      await int.reply({
        content: "✅ **Has reclamado el ticket exitosamente.**",
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await int.reply({
        content: "❌ **Ocurrió un error al procesar tu solicitud. Intenta nuevamente más tarde.**",
        ephemeral: true,
      });
    }
  }
}

module.exports = Example;
const { ModalSubmit } = require("@models");
const {
  CacheType,
  ModalSubmitInteraction,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");
const { QuickDB } = require("quick.db");
const admin = require("./../../../../mongodb/models/problemaA");

const db = new QuickDB();

// Constantes para IDs y configuraciones
const REMOTE_GUILD_ID = "1328581555077120081";
const REMOTE_CATEGORY_ID = "1330039456048353320";
const STAFF_ROLE_ID = "1328840022840971314";

class Example extends ModalSubmit {
  constructor() {
    super("ticketModal");
  }

  async run(client, interaction) {
    try {
      const asunto = interaction.fields.getTextInputValue("asuntoInput");
      const descripcion = interaction.fields.getTextInputValue("descripcionInput");
      const authorId = interaction.user.id;

      // --- SERVIDOR LOCAL ---
      const guild = client.guilds.cache.get(interaction.guild.id);
      const localChannels = guild.channels.cache.filter((c) =>
        c.name.startsWith(`ticket-${interaction.user.username.toLowerCase()}`)
      );

      if (localChannels.size > 0) {
        const existingTicket = await admin.findOne({ author: authorId });
        return interaction.reply({
          content: `⚠️ Ya tienes un ticket abierto en <#${existingTicket.tiketid}>.`,
          ephemeral: true,
        });
      }

      const localCategoryId = await db.get(`ticket_category_${interaction.guild.id}`);
      if (!localCategoryId) {
        return interaction.reply({
          content:
            "⚠️ No se ha configurado una categoría para los tickets en este servidor. Usa `/set-category <categoryId>` para configurarla.",
          ephemeral: true,
        });
      }

      const localCategoryChannel = guild.channels.cache.get(localCategoryId);
      if (!localCategoryChannel || localCategoryChannel.type !== ChannelType.GuildCategory) {
        return interaction.reply({
          content:
            "⚠️ La categoría configurada no es válida. Usa `/set-category <categoryId>` para actualizarla.",
          ephemeral: true,
        });
      }

      // --- CREAR EL CANAL EN EL SERVIDOR LOCAL ---
      const localChannel = await guild.channels.create({
        name: `ticket-${interaction.user.username.toLowerCase()}`,
        parent: localCategoryId,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [PermissionFlagsBits.ViewChannel],
            deny: [PermissionFlagsBits.SendMessages],
          },
        ],
        reason: `Ticket creado para ${interaction.user.tag}`,
      });

      // --- SERVIDOR REMOTO ---
      const remoteGuild = client.guilds.cache.get(REMOTE_GUILD_ID);
      if (!remoteGuild) {
        return interaction.reply({
          content: `⚠️ El servidor remoto configurado no es válido o no estoy en él.`,
          ephemeral: true,
        });
      }

      const remoteCategoryChannel = remoteGuild.channels.cache.get(REMOTE_CATEGORY_ID);
      if (!remoteCategoryChannel || remoteCategoryChannel.type !== ChannelType.GuildCategory) {
        return interaction.reply({
          content: `⚠️ La categoría remota configurada no es válida.`,
          ephemeral: true,
        });
      }

      const staffRole = remoteGuild.roles.cache.get(STAFF_ROLE_ID);
      if (!staffRole) {
        return interaction.reply({
          content: `⚠️ El rol de staff configurado no es válido en el servidor remoto.`,
          ephemeral: true,
        });
      }

      // Crear el canal en el servidor remoto
      const remoteChannel = await remoteGuild.channels.create({
        name: `ticket-${interaction.user.username.toLowerCase()}`,
        parent: REMOTE_CATEGORY_ID,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: remoteGuild.roles.everyone.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: staffRole.id,
            allow: [PermissionFlagsBits.ViewChannel],
            deny: [PermissionFlagsBits.SendMessages],
          },
          {
            id: interaction.user.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
          },
        ],
        reason: `Ticket sincronizado para ${interaction.user.tag}`,
      });

      // --- GUARDAR RELACIÓN ENTRE LOS TICKETS ---
      let ticketData = await admin.findOne({ author: authorId });
      let savedDataId;

      if (!ticketData) {
        const newTicket = new admin({
          message: descripcion,
          asunt: asunto,
          author: authorId,
          tiketid: localChannel.id,
          remoteTiketId: remoteChannel.id,
          status: "earring",
        });
        const savedTicket = await newTicket.save();
        savedDataId = savedTicket._id;
      } else {
        const updatedTicket = await admin.findOneAndUpdate(
          { author: authorId },
          {
            message: descripcion,
            asunt: asunto,
            tiketid: localChannel.id,
            remoteTiketId: remoteChannel.id,
            status: "earring",
          },
          { new: true }
        );
        savedDataId = updatedTicket._id;
      }

      // --- EMBED 1: INFORMACIÓN INICIAL ---
      const embedInfo = new EmbedBuilder()
        .setAuthor({
          name: `Celunyx | Atención al Cliente`,
        })
        .setTitle(`🎫 **Ticket Creado con Éxito**`)
        .setDescription(
          `Bienvenido a nuestro sistema de tickets. Mientras esperas (porque claramente somos muy rápidos), aquí tienes un par de instrucciones que *probablemente deberías leer*.`
        )
        .addFields(
          {
            name: "📋 **Información Importante**",
            value:
              "Incluye los siguientes detalles para que tu ticket no termine en el olvido:\n- Una descripción clara del problema.\n- Pasos que seguiste antes de encontrarte con esta maravilla.\n- Capturas de pantalla o pruebas relevantes (no esperes que adivinemos).",
          },
          {
            name: "⏳ **Tiempo de Respuesta Estimado**",
            value:
              "Nos tomamos esto en serio... la mayoría de las veces. Nuestro equipo responde generalmente en **24-48 horas** (pero puede que lo hagamos antes, si tenemos ganas).",
          },
          {
            name: "📂 **Privacidad del Ticket**",
            value:
              "Tranquilo, este ticket es **privado**. Solo tú y nuestro equipo de soporte podrán verlo. Así que no temas, tus secretos están a salvo (por ahora).",
          },
          {
            name: "❓ **¿Cerrar el Ticket?**",
            value:
              "Si milagrosamente tu consulta se resuelve, puedes cerrar el ticket con el comando: `kf!cerrar`.",
          }
        )
        .setColor(0x1e1e2f)
        .setFooter({
          text: `Gracias por usar nuestro servicio, aunque sabemos que no tenías otra opción.`,
        })
        .setTimestamp();

      // --- EMBED 2: DETALLES DEL TICKET ---
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `Nuevo Ticket - ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTitle(`📌 Detalles del Ticket`)
        .setDescription(
          `Aquí está la información de tu ticket. *Trata de no perderla, ¿vale?*`
        )
        .addFields(
          { name: "📝 **Asunto**", value: `\`${asunto}\``, inline: false },
          { name: "🖋️ **Descripción**", value: `\`${descripcion}\``, inline: false },
          { name: "👤 **Usuario**", value: `<@${interaction.user.id}>`, inline: true },
          { name: "📅 **Fecha de Creación**", value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
        )
        .setColor(0x1e1e2f)
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setImage("https://media.discordapp.net/attachments/1330691603698024488/1331427816784269383/Doradito.png?ex=67919448&is=679042c8&hm=2a4e99264f645e6ca4821c934d7c329ffd9053c79f72d0d6801fa2b50031ece6&=&format=webp&quality=lossless&width=1025&height=269")
        .setFooter({
          text: `ID del Ticket: ${savedDataId}`,
          iconURL: client.user.displayAvatarURL(),
        });

      // --- BOTONES ---
      const claimButton = new ButtonBuilder()
        .setCustomId("claim")
        .setLabel("🎟️ Reclamar Ticket")
        .setStyle(ButtonStyle.Success);

      const closeButton = new ButtonBuilder()
        .setCustomId("close_ticket")
        .setLabel("❌ Cerrar Ticket")
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder().addComponents(claimButton, closeButton);

      // Enviar el embed y los botones a ambos canales
      await localChannel.send({ embeds: [embedInfo] });
      const localMessage = await localChannel.send({ embeds: [embed] });
      const remoteMessage = await remoteChannel.send({ embeds: [embed], components: [row] });

      await admin.findByIdAndUpdate(
        savedDataId,
        {
          localMessageId: localMessage.id,
          remoteMessageId: remoteMessage.id,
        },
        { new: true }
      );

      // Respuesta al usuario
      await interaction.reply({
        content: `✅ Ticket creado con éxito en <#${localChannel.id}>.`,
        ephemeral: true,
      });

    } catch (error) {
      console.error("Error al procesar el ticket:", error);
      await interaction.reply({
        content: "⚠️ Hubo un error al procesar tu ticket. Por favor, inténtalo de nuevo más tarde.",
        ephemeral: true,
      });
    }
  }
}

module.exports = Example;
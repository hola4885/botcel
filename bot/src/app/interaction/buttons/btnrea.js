const { Buttons } = require("@models");
const {
    ButtonInteraction,
    EmbedBuilder,
    ButtonStyle,
    ChannelType,
    PermissionFlagsBits,
} = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const regp = require("./../../../../../mongodb/models/problemaA");

class ReopenTicket extends Buttons {
    constructor() {
        super("reopen_ticket"); // ID único del botón
    }

    async run(client, int) {
        // Verificar que el mensaje tiene un embed con un footer válido
        if (!int.message.embeds[0] || !int.message.embeds[0].footer || !int.message.embeds[0].footer.text) {
            return int.reply({
                content: "❌ No se pudo encontrar la ID del ticket.",
                ephemeral: true,
            });
        }

        const preguntaId = int.message.embeds[0].footer.text.slice(11);
        const data = await regp.findById(preguntaId);

        // Verificar si existe información del ticket en la base de datos
        if (!data) {
            return int.reply({
                content: "❌ No se pudo encontrar información del ticket.",
                ephemeral: true,
            });
        }

        if (data.status === "open") {
            return int.reply({
                content: "❌ El ticket ya está abierto.",
                ephemeral: true,
            });
        }

        const primaryGuildId = "1245743198957998112"; // ID del primer servidor
        const secondaryGuildId = "1328581555077120081"; // ID del segundo servidor

        const primaryArchiveCategoryId = "1277131677138812978"; // Categoría del primer servidor
        const secondaryArchiveCategoryId = "1330039456048353320"; // Categoría del segundo servidor

        try {
            // Obtener los servidores
            const primaryGuild = await client.guilds.fetch(primaryGuildId);
            const secondaryGuild = await client.guilds.fetch(secondaryGuildId);

            if (!primaryGuild || !secondaryGuild) {
                return int.reply({
                    content: "❌ No se pudo acceder a la información de uno o ambos servidores.",
                    ephemeral: true,
                });
            }

            // Obtener las categorías de archivo
            const primaryArchiveCategory = primaryGuild.channels.cache.get(primaryArchiveCategoryId);
            const secondaryArchiveCategory = secondaryGuild.channels.cache.get(secondaryArchiveCategoryId);

            if (!primaryArchiveCategory || primaryArchiveCategory.type !== ChannelType.GuildCategory ||
                !secondaryArchiveCategory || secondaryArchiveCategory.type !== ChannelType.GuildCategory) {
                return int.reply({
                    content: "❌ No se pudieron encontrar las categorías de archivo en uno o ambos servidores. Verifica la configuración.",
                    ephemeral: true,
                });
            }

            // Mover el canal actual a la categoría de archivo del primer servidor
            const currentChannel = int.channel;
            await currentChannel.setParent(secondaryArchiveCategoryId, { lockPermissions: false });

            // Si hay un canal asociado, moverlo a la categoría del segundo servidor
            const archivedChannelId = data.tiketid;
            const archivedChannel = await client.channels.fetch(archivedChannelId);

            if (archivedChannel) {
                await archivedChannel.setParent(primaryArchiveCategoryId, { lockPermissions: false });
            }

            // Actualizar el estado del ticket en la base de datos
            data.status = "open";
            await data.save();

            // Obtener el usuario creador del ticket
            const ticketOwner = await client.users.fetch(data.author);

            // Actualizar permisos del canal para el usuario
            await currentChannel.permissionOverwrites.edit(ticketOwner, {
                ViewChannel: true,
                SendMessages: true,
            });

            // Enviar un mensaje al canal informando que el ticket fue reabierto
            await currentChannel.send(`🔓 **El ticket ha sido reabierto.**`);
            await archivedChannel.send(`🔓 **El ticket ha sido reabierto.**`);

            // Eliminar el mensaje original del botón
            await int.message.delete();

            // Enviar un mensaje privado al creador del ticket
            try {
                await ticketOwner.send(`✅ Tu ticket ha sido reabierto en el servidor. Puedes continuar la conversación en el canal correspondiente.`);
            } catch (error) {
                console.error(`No se pudo enviar un mensaje privado a ${ticketOwner.tag}:`, error);
            }
        } catch (error) {
            console.error("Error al reabrir el ticket:", error);
            return int.reply({
                content: "❌ Ocurrió un error al intentar reabrir el ticket.",
                ephemeral: true,
            });
        }
    }
}

module.exports = ReopenTicket;

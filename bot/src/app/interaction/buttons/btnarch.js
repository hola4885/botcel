const { Buttons } = require("@models");
const {
    ButtonInteraction,
    EmbedBuilder,
    ButtonStyle,
    ChannelType,
} = require("discord.js");
const regp = require("./../../../../mongodb/models/problemaA");

class ArchiveTicket extends Buttons {
    constructor() {
        super("archive_ticket"); // ID único del botón
    }

    async run(client, int) {
        try {
            // Obtener el ID del ticket desde el embed del mensaje
            const preguntaId = int.message.embeds[0]?.footer?.text?.slice(11);
            if (!preguntaId) {
                return int.reply({
                    content: "❌ No se pudo encontrar el ID del ticket en el mensaje.",
                    ephemeral: true,
                });
            }

            // Buscar datos del ticket en la base de datos
            const data = await regp.findById(preguntaId);
            if (!data) {
                return int.reply({
                    content: "❌ No se pudo encontrar información del ticket en la base de datos.",
                    ephemeral: true,
                });
            }

            // IDs de los servidores y categorías 1331050096468426835
            const primaryGuildId = "1328581555077120081"; // ID del primer servidor
            const secondaryGuildId = "1245743198957998112"; // ID del segundo servidor
            const primaryArchiveCategoryId = "1331050499293708400"; // Categoría en el primer servidor
            const secondaryArchiveCategoryId = "1331050096468426835"; // Categoría en el segundo servidor

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

            // Mover los canales asociados
            const currentChannel = int.channel;
            const archivedChannelId = data.tiketid;
            const archivedChannel = await client.channels.fetch(archivedChannelId);
            if(data.status === "arch"){
                return int.reply({
                    content: "❌ El ticket ya esta archivado.",
                    ephemeral: true,
                });;
            }
            // Actualizar el estado del ticket en la base de datos
            data.status = "arch";
            await data.save();

            // Mover el canal actual al primer servidor
            await currentChannel.setParent(primaryArchiveCategoryId, { lockPermissions: false });

            // Si hay un canal asociado, moverlo al segundo servidor
            if (archivedChannel) {
                await archivedChannel.setParent(secondaryArchiveCategoryId, { lockPermissions: false });
            }
            const user = int.user;

            // Enviar confirmación con embed
            const embed = EmbedBuilder.from(int.message.embeds[0]);

            embed.setColor("#ff9f00")    
                           .setDescription(`El ticket ha sido archivado por ${int.user}.`)
            .setTitle("📂 Ticket Archivado")

            .addFields({ name: "`El reporte ha sido aceptado por el staff:", value: `${user.tag}`, inline: true });
          
                await archivedChannel.send(`📃 **El ticket ha sido archivado.**`);

             int.update({ embeds: [embed] });
            const ticketOwner = await client.users.fetch(data.author);

            try {
                await ticketOwner.send(`📃 Tu ticket ha sido archivado en el servidor. Tu ticket esta pendiente.`);
            } catch (error) {
                console.error(`No se pudo enviar un mensaje privado a ${ticketOwner.tag}:`, error);
            }
        } catch (error) {
            console.error("Error al archivar el ticket:", error);
            return int.reply({
                content: "❌ Hubo un error al archivar el ticket. Inténtalo de nuevo más tarde.",
                ephemeral: true,
            });
        }
    }
}

module.exports = ArchiveTicket;

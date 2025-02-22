const Client = require("@client");
const { PrefixCommands } = require("@models");
const { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

/**
 * Clase para representar el comando forceclose.
 * @extends PrefixCommands
 */
class ForceClose extends PrefixCommands {
    constructor() {
        super({
            name: "forceclose",
        });
    }

    /**
     * Ejecuta la lógica asociada al comando de prefijo.
     * @param {Client} client - El cliente Discord.js.
     * @param {Message<boolean>} message - El mensaje que activó el comando.
     * @param {string[]} args - Los argumentos del comando.
     */
    async run(client, message, args) {
        try {
            const pems = message.member.permissions.has("ManageChannels");
            if (!pems) return message.channel.send({ content: "No tienes permisos suficientes para usar este comando.", ephemeral: true });

            const bot = message.guild.members.cache.get(client.user.id);
            const permsb = bot.permissions.has("ManageChannels");
            if (!permsb) return message.channel.send("El bot no tiene permisos suficientes para gestionar canales.");

            const ticketID = args[0];
            const reason = args.slice(1).join(" ");
            if (!ticketID || !reason) {
                return message.channel.send("Uso correcto: `zzp!forceclose <id_del_ticket> <razón>`");
            }

            // Buscar el canal con el ID del ticket en su nombre
            const ticketChannel = message.guild.channels.cache.find(
                (channel) => channel.name.includes(`ticket-${ticketID}`)
            );

            if (!ticketChannel) {
                return message.channel.send(`No se encontró un canal con el ID del ticket: \`${ticketID}\``);
            }

            const creatorID = ticketChannel.topic?.split("Creado por: ")[1];
            const creator = await client.users.fetch(creatorID).catch(() => null);

            await ticketChannel.permissionOverwrites.set([
                {
                    id: message.guild.roles.everyone.id,
                    deny: ["ViewChannel", "SendMessages"],
                },
            ]);

            const newChannelName = `cerrado-${ticketChannel.name}`;
            await ticketChannel.setName(newChannelName);

            const embedClose = new EmbedBuilder()
                .setTitle("📁 Ticket Cerrado")
                .setDescription(`Este ticket ha sido cerrado por ${message.author.tag}.\n**Razón:** ${reason}`)
                .setColor("#FF0000")
                .setFooter({ text: `ID del Ticket: ${ticketID}` })
                .setTimestamp();

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("reopen_ticket")
                    .setLabel("Reabrir")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("archive_ticket")
                    .setLabel("Archivar")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("delete_ticket")
                    .setLabel("Borrar")
                    .setStyle(ButtonStyle.Danger)
            );

            await ticketChannel.send({ embeds: [embedClose], components: [row] });

            const embedConfirm = new EmbedBuilder()
                .setDescription(`El ticket con ID \`${ticketID}\` ha sido cerrado correctamente.`)
                .setColor("#4D00FF");

            await message.channel.send({ embeds: [embedConfirm] });

            if (creator) {
                const dmEmbed = new EmbedBuilder()
                    .setTitle("📁 Tu ticket ha sido cerrado")
                    .setDescription(`**Razón:** ${reason}\n\nPuedes contactar al staff si necesitas reabrirlo.`)
                    .setColor("#FF0000")
                    .setTimestamp();

                await creator.send({ embeds: [dmEmbed] }).catch(() => {
                    message.channel.send("No se pudo enviar un mensaje directo al creador del ticket.");
                });
            }

            const collector = ticketChannel.createMessageComponentCollector({ time: 86400000 });

            collector.on("collect", async (interaction) => {
                if (!interaction.isButton()) return;
                if (!message.member.permissions.has("ManageChannels")) {
                    return interaction.reply({ content: "No tienes permisos para usar esta opción.", ephemeral: true });
                }

                switch (interaction.customId) {
                    case "reopen_ticket":
                        const reopenCategoryID = "1277131677138812978"; // Categoría para tickets reabiertos
                        const reopenCategory = message.guild.channels.cache.get(reopenCategoryID);

                        if (!reopenCategory || reopenCategory.type !== 4) {
                            return interaction.reply({ content: "No se pudo encontrar la categoría de tickets reabiertos.", ephemeral: true });
                        }

                        await ticketChannel.permissionOverwrites.set([
                            {
                                id: message.guild.roles.everyone.id,
                                allow: ["ViewChannel", "SendMessages"],
                            },
                        ]);

                        await ticketChannel.setName(ticketChannel.name.replace("cerrado-", ""));
                        await ticketChannel.setParent(reopenCategoryID);

                        interaction.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription("El ticket ha sido reabierto y movido a la categoría de tickets reabiertos.")
                                    .setColor("#00FF00"),
                            ],
                            components: [],
                        });

                        if (creator) {
                            const reopenEmbed = new EmbedBuilder()
                                .setTitle("📂 Tu ticket ha sido reabierto")
                                .setDescription("Puedes volver a usar tu ticket. Gracias por tu paciencia.")
                                .setColor("#00FF00");
                            await creator.send({ embeds: [reopenEmbed] }).catch(() => null);
                        }
                        break;

                    case "archive_ticket":
                        const archiveCategoryID = "1327817160206323732";
                        const archiveCategory = message.guild.channels.cache.get(archiveCategoryID);
                        if (archiveCategory?.type === 4) {
                            await ticketChannel.setParent(archiveCategoryID);
                            interaction.update({
                                embeds: [
                                    new EmbedBuilder()
                                        .setDescription("El ticket ha sido archivado.")
                                        .setColor("#FFA500"),
                                ],
                                components: [],
                            });
                        } else {
                            interaction.reply({ content: "No se encontró la categoría de archivo.", ephemeral: true });
                        }
                        break;

                    case "delete_ticket":
                        await ticketChannel.delete(`Eliminado por ${interaction.user.tag}`);
                        interaction.reply({ content: "El ticket ha sido eliminado.", ephemeral: true });
                        break;

                    default:
                        break;
                }
            });
        } catch (e) {
            console.error(String(e.stack));
            const logChannel = client.channels.cache.get("1087093972700250284");
            if (logChannel) {
                logChannel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#FF0000")
                            .setTitle("❌ ERROR | Ha ocurrido un error")
                            .setDescription(
                                `\`\`\`${
                                    e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)
                                }\`\`\``
                            )
                            .setTimestamp(),
                    ],
                });
            }
        }
    }
}

module.exports = ForceClose;
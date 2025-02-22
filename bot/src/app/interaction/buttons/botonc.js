const Client = require("@client");
const { Buttons } = require("@models");
const { 
    ButtonInteraction, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonStyle, 
    ButtonBuilder, 
    CacheType 
} = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const regp = require('./../../../../../mongodb/models/problemaA');
const config = require('../../../../cnf/config.json');

class Example extends Buttons {
    constructor() {
        super("cerrar_ticket");
    }

    async run(client, int) {
        try {
            // Obtener ID del ticket del footer
            const preguntaId = int.message.embeds[0].footer.text.slice(15);
            const data = await regp.findById(preguntaId);

            if (!data) {
                return int.reply({
                    content: "❌ **No se encontró información sobre este ticket.**",
                    ephemeral: true,
                });
            }

            const user = await client.users.fetch(data.author); // Obtener el usuario que creó el ticket
const canalIds = data.tiketid;  // Reemplaza con la ID del canal que deseas obtener
data.status = "closed"; // Guarda la ID del staff que reclama el ticket
      await data.save(); // Guarda los cambios en la base de datos
// Obtener el canal usando client.channels.fetch
const canals = await client.channels.fetch(canalIds);
            // Denegar permisos al usuario
            await canals.permissionOverwrites.edit(user, {
                SendMessages: false, // Bloquear enviar mensajes
                AddReactions: false, // Bloquear agregar reacciones
            });

            // Crear embed con las opciones del ticket
            const ticketEmbed = new EmbedBuilder()
                .setColor("#f54242")
                .setFooter({ text: `Ticket ID: ${preguntaId}` })
                .setTitle("🎟️ Opciones del Ticket")
                .setDescription("Selecciona una de las siguientes opciones para gestionar este ticket.");

            // Crear botones de acción
            const reopenButton = new ButtonBuilder()
                .setCustomId("reopen_ticket")
                .setLabel("Reabrir")
                .setStyle(ButtonStyle.Success);

            const archiveButton = new ButtonBuilder()
                .setCustomId("archive_ticket")
                .setLabel("Archivar")
                .setStyle(ButtonStyle.Secondary);

            const deleteButton = new ButtonBuilder()
                .setCustomId("delete_ticket")
                .setLabel("Borrar")
                .setStyle(ButtonStyle.Danger);

            const ticketActionRow = new ActionRowBuilder().addComponents(reopenButton, archiveButton, deleteButton);

            // Enviar embed al canal con las opciones para el staff
            await int.reply({
                embeds: [ticketEmbed],
                components: [ticketActionRow],
                ephemeral: false,
            });

            // Confirmar al usuario que el ticket ha sido cerrado temporalmente
            const canalId = data.tiketid; // ID del canal

const canal = client.channels.cache.get(canalId);
 // Si el canal no está en la caché, intenta obtenerlo de la API
        if (!canal) {
            console.error(`No se encontró el canal con ID: ${canalId}`);
            return;
        }
            await canal.send(`🔒 **El ticket ha sido cerrado temporalmente.** Un miembro del staff decidirá la acción siguiente.`);
        } catch (error) {
            console.error(error);
            await int.reply({
                content: "❌ **Ocurrió un error al procesar la acción. Intenta nuevamente más tarde.**",
                ephemeral: true,
            });
        }
    }
}

module.exports = Example;
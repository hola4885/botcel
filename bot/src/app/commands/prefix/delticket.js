const Client = require("@client");
const { PrefixCommands } = require("@models");
const { Message } = require("discord.js");
const { EmbedBuilder } = require('discord.js');

/**
 * Clase para representar el comando delticket.
 * @extends PrefixCommands
 */
class DelTicket extends PrefixCommands {
    constructor() {
        super({
            name: "delticket"
        });
    };

    /**
     * Ejecuta la lógica asociada al comando de prefijo.
     * @param {Client} client - El cliente Discord.js.
     * @param {Message<boolean>} message - El mensaje que activó el comando.
     * @param {string[]} args - Los argumentos del comando.
     */
    async run(client, message, args) {
        try {
 const staffRoleId = "1277604736626982932";  // Reemplaza con el ID del rol Staff

            // Verificar si el miembro tiene el rol "Staff" por ID
            const hasStaffRole = message.member.roles.cache.has(staffRoleId);
            if (!hasStaffRole) return message.channel.send({ content: `No tienes permisos suficientes para usar este comando.`, ephemeral: true });

            // Verificar permisos del bot
            const bot = message.guild.members.cache.get(client.user.id);
            const permsb = bot.permissions.has("ManageChannels");
            if (!permsb) return message.channel.send("El bot no tiene permisos suficientes para gestionar canales.");

            // Verificar que el comando se use en un canal de ticket
            if (!message.channel.name.startsWith("ticket-")) {
                return message.channel.send("Este comando solo puede ser usado en canales de tickets.");
            }

            // Verificar que se haya mencionado un usuario
            const user = message.mentions.members.first();
            if (!user) return message.channel.send("Debes mencionar un usuario válido. Uso: `zzp!delticket @usuario`");

            // Eliminar permisos del usuario mencionado
            await message.channel.permissionOverwrites.edit(user, {
                ViewChannel: false,
                SendMessages: false
            });

            // Responder con un mensaje de éxito
            const embed = new EmbedBuilder()
                .setDescription(`${user} ya no tiene acceso a este ticket.`)
                .setColor("#FF0000");

            message.channel.send({ embeds: [embed] });

        } catch (e) {
            console.error(String(e.stack));
            const channel = client.channels.cache.get('1087093972700250284'); // Cambiar por un canal de logs si es necesario
            channel.send({
                embeds: [new EmbedBuilder()
                    .setColor("#FF0000")
                    .setTitle("❌ ERROR | Ha ocurrido un error")
                    .setDescription(`\`\`\`${e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``)
                    .setTimestamp()]
            });
        }
    }
}

module.exports = DelTicket;
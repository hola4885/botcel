const { Events } = require("@models");
const Client = require("@client");
const { Message } = require("discord.js");
const config = require('../../../../config');

/**
 * Clase para representar el evento 'messageCreate'.
 * @extends Events
 */
class Ready extends Events {
    constructor() {
        super('messageCreate');
    }

    /**
     * Ejecuta la lógica asociada al evento 'messageCreate'.
     * @param {Client} client - El cliente Discord.js.
     * @param {Message} message - El mensaje recibido.
     */
    async run(client, message) {
        let prefix = client.keys.prefix || "?";

        // Ignorar mensajes de bots
        if (message.author?.bot) return;

        // Respuesta si el bot es mencionado
        if (message.content.includes(client.user.id)) {
            return message.reply({ 
                content: `Utiliza el comando \`${prefix}\` para descubrir todo lo que KinglyFenix Studios tiene para ofrecerte.`, 
                allowedMentions: { repliedUser: true } 
            });
        }

        // Ignorar mensajes que no comiencen con el prefijo configurado
        if (!message.content.startsWith(client.keys.prefix)) return;

        let args = message.content.slice(client.keys.prefix.length).trim().split(/\s+/g);
        let cmd = client.commands.prefix.get(args[0]) || client.commands.prefix.find((cmd) => cmd.alias && cmd.alias.includes(args[0]));

        // Validar si el comando existe y tiene una función 'run'
        if (!cmd || (cmd && !cmd.run)) return;
        // Restringir comandos a desarrolladores si está configurado
        if (cmd.dev && !client.keys.devs.includes(message.author.id)) {
            return message.channel.send({ 
                content: "Este comando está limitado a desarrolladores." 
            });
        }
        // Verificar roles permitidos
        if (cmd.roles) {
            const memberRoles = message.member.roles.cache.map(role => role.id); // Obtén los roles del miembro
            const hasRole = cmd.roles.some(role => memberRoles.includes(role)); // Verifica si tiene alguno de los roles permitidos

            if (!hasRole) {
                return message.channel.send({
                    content: "No tienes los permisos necesarios para usar este comando."
                });
            }
        }

        // Ejecutar el comando
        if (cmd) {
            try {
                console.log("[Comando activado]: " + `${args[0]} [Usuario]: ${message.author.username}`);
                await cmd.run(client, message, args.slice(1));
            } catch (error) {
                console.error("[Error en el comando]:", error.stack.slice(0, 300));
            }
        }
    }
}

module.exports = Ready;
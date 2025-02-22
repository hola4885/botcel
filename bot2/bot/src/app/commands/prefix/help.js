const Client = require("@client");
const { PrefixCommands } = require("@models");
const { Message } = require("discord.js");

/**
 * Clase para representar el comando de ayuda (help).
 * @extends PrefixCommands
 */
class Help extends PrefixCommands {
    constructor() {
        super({
            name: "help",
            alias: ["h", "ayuda"], // Alias opcionales
       });
    }

    /**
     * Ejecuta la lógica asociada al comando 'help'.
     * @param {Client} client - El cliente Discord.js.
     * @param {Message<boolean>} message - El mensaje que activó el comando.
     * @param {string[]} args - Los argumentos del comando.
     */
    async run(client, message, args) {
        // Obtener los roles del usuario
        const userRoles = message.member?.roles.cache.map(role => role.id) || []; // IDs de roles asignados al usuario
        const isDeveloper = client.keys.devs.includes(message.author.id); // Validar si es desarrollador

        // Obtener todos los comandos cargados
        const allCommands = client.commands.prefix;

        // Filtrar los comandos según los roles del usuario
        const availableCommands = [];
        for (const [name, command] of allCommands.entries()) {
            // Verificar si el comando tiene restricciones de roles
            if (command.dev && !isDeveloper) continue; // Comando exclusivo para desarrolladores
            if (command.roles && command.roles.length > 0) {
                // Si el comando tiene roles específicos, verificar si el usuario tiene acceso
                const hasAccess = command.roles.some(roleId => userRoles.includes(roleId));
                if(command.ownerOnly) continue;
                if (!hasAccess) continue; // Si no tiene un rol permitido, ignorar el comando
            }

            // Agregar comando a la lista de disponibles
            availableCommands.push({
                name: name,
                description: command.description || "Sin descripción", // Usa la descripción del comando, si existe
                alias: command.alias || [], // Alias del comando
            });
        }

        // Crear el mensaje de ayuda
        const helpMessage = availableCommands
            .map(
                cmd =>
                    `**${client.keys.prefix}${cmd.name}**: ${cmd.description}${
                        cmd.alias.length ? ` (Alias: ${cmd.alias.join(", ")})` : ""
                    }`
            )
            .join("\n");

        // Responder con los comandos disponibles
        return message.channel.send({
            content: `**Comandos disponibles para ti:**\n\n${helpMessage || "No tienes comandos disponibles."}`,
        });
    }
}

module.exports = Help;

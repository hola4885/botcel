const Client = require("@client");
const { PrefixCommands } = require("@models");
const { Message } = require("discord.js");

/**
 * Clase para representar un comando exclusivo del dueño.
 * @extends PrefixCommands
 */
class Owner extends PrefixCommands {
    constructor() {
        super({
            name: "owner",  
            description: "Banea a un usuario del servidor.",
            alias: ["o", "admin"], // Alias opcionales
            ownerOnly: true, // Asegura que solo el dueño pueda usarlo
        });
    }

    /**
     * Ejecuta la lógica asociada al comando del dueño.
     * @param {Client} client - El cliente Discord.js.
     * @param {Message<boolean>} message - El mensaje que activó el comando.
     * @param {string[]} args - Los argumentos del comando.
     */
    run(client, message, args) {
        // Lógica del comando para el dueño
        if (args[0] === "shutdown") {
            message.channel.send("El bot se está apagando...");
            return process.exit(0); // Cierra el proceso del bot
        }
        message.channel.send("Comando owner ejecutado.");
    }
}

module.exports = Owner;

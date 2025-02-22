const Client = require("@client");
const { PrefixCommands } = require("@models");
const { Message } = require("discord.js");

/**
 * Clase para representar un ejemplo de comando de prefijo.
 * @extends PrefixCommands
 */
class Example extends PrefixCommands {
    constructor(){
        super({
            name: "example",
            alias: ["h", "ayuda"], // Alias opcionales
                        roles: ["123456789012345678", "987654321098765432"], // IDs de roles permitidos

       
        });
    };

    /**
     * Ejecuta la lógica asociada al comando de prefijo.
     * @param {Client} client - El cliente Discord.js.
     * @param {Message<boolean>} message - El mensaje que activó el comando.
     * @param {string[]} args - Los argumentos del comando.
     */
    run(client, message, args) {
        const music = new MiClase(client);
 music.serverq();
    }
}

module.exports = Example;

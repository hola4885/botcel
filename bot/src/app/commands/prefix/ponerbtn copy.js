const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const Client = require("@client");
const { PrefixCommands } = require("@models");
const { Message } = require("discord.js");

/**
 * Clase para representar un ejemplo de comando de prefijo.
 * @extends PrefixCommands
 */
class Example extends PrefixCommands {
    constructor() {
        super({
            name: "botonm", // Nombre del comando
        });
    }

    /**
     * Ejecuta la lógica asociada al comando de prefijo.
     * @param {Client} client - El cliente Discord.js.
     * @param {Message<boolean>} message - El mensaje que activó el comando.
     * @param {string[]} args - Los argumentos del comando.
     */
    async run(client, message, args) {
        // Verificar si se proporcionó un ID de mensaje como argumento
        if (!args[0]) {
            return message.reply("Por favor, proporciona el ID del mensaje al que deseas agregar un botón.");
        }

        const messageId = args[0];
        const channel = message.channel;

        try {
            // Obtener el mensaje original por su ID
            const targetMessage = await channel.messages.fetch(messageId);
            if (!targetMessage) {
                return message.reply("No se encontró ningún mensaje con ese ID en este canal.");
            }

            // Verificar si el mensaje tiene un embed
            const embed = targetMessage.embeds[0];
            if (!embed) {
                return message.reply("El mensaje especificado no contiene un embed.");
            }

                       // Crear un botón
                       const button = new ButtonBuilder()
                       .setCustomId("Crear_Staff")
                       .setLabel("Nuevo Staff")
                       .setEmoji("✅")
                       .setStyle(ButtonStyle.Primary);
            // Crear una fila de componentes
            const row = new ActionRowBuilder().addComponents(button);

            // Enviar un nuevo mensaje con el botón, haciendo referencia al mensaje original
            await channel.send({
                content: ``,
                embeds: [embed], // Incluye el embed original para mantener el contexto
                components: [row],
            });

            message.reply("El botón fue agregado correctamente como un nuevo mensaje relacionado.");
        } catch (error) {
            console.error("Error al agregar el botón:", error);
            message.reply("Hubo un error al intentar agregar un botón al mensaje.");
        }
    }
}

module.exports = Example;

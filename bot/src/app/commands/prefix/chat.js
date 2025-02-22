const Client = require("@client");
const { PrefixCommands } = require("@models");
const { Message } = require("discord.js");

/**
 * Clase para representar un ejemplo de comando de prefijo.
 * @extends PrefixCommands
 */
class chat extends PrefixCommands {
    constructor(){
        super({
            name: "chat"
        });
    };

    /**
     * Ejecuta la lógica asociada al comando de prefijo.
     * @param {Client} client - El cliente Discord.js.
     * @param {Message<boolean>} message - El mensaje que activó el comando.
     * @param {string[]} args - Los argumentos del comando.
     */
  async  run(client, message, args) {
    if (!args[0]) return message.reply({ embeds: [
        new EmbedBuilder()
          .setTitle("Argumento faltante")
          .setDescription("¡Proporcione un nuevo prefix!")
      ]});
  
     
      
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        messages: args[0],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      const reply = response.choices[0].message.content;
      message.channel.send(reply);
    }
}

module.exports = chat;

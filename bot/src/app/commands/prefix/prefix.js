const Client = require("@client");
const { PrefixCommands } = require("@models");
const { Message, EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

/**
 * Clase para representar un ejemplo de comando de prefijo.
 * @extends PrefixCommands
 */
class Example extends PrefixCommands {
    constructor(){
        super({
            name: "prefix"
        });
    };

    /**
     * Ejecuta la lógica asociada al comando de prefijo.
     * @param {Client} client - El cliente Discord.js.
     * @param {Message<boolean>} message - El mensaje que activó el comando.
     * @param {string[]} args - Los argumentos del comando.
     */
    run(client, message, args) {
        try{
            if (!args[0]) return message.reply({ embeds: [
                new EmbedBuilder()
                  .setTitle("Argumento faltante")
                  .setDescription("¡Proporcione un nuevo prefix!")
              ]});
          
              if (args[0].length > 5) return message.reply({ embeds: [
                new EmbedBuilder()
                  .setTitle("Argumento faltante")
                  .setDescription("Lo sentimos, pero la longitud del nuevo prefix no debe superar los 5 caracteres.")
              ]});
          
              const newPrefix =  db.set(`guild_prefix_${message.guild.id}`, args[0]);
          
              const finalEmbed = new EmbedBuilder()
                .setTitle("Éxito!")
                .setDescription(`Nuevo prefijo para este servidor: \`${newPrefix}\`.`)
                .setColor("Green");
          
              return message.reply({ embeds: [finalEmbed] });
            }catch(e){console.log(String(e.stack))
            }}}


module.exports = Example;

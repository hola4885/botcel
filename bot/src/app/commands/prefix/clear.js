const Client = require("@client");
const { PrefixCommands } = require("@models");
const { Message } = require("discord.js");
const { EmbedBuilder,ActionRowBuilder,ButtonBuilder } = require('discord.js');

/**
 * Clase para representar un ejemplo de comando de prefijo.
 * @extends PrefixCommands
 */
class Example extends PrefixCommands {
    constructor(){
        super({
            name: "clear"
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
            const pems = message.member.permissions.has("Administrator");
              if(!pems) return message.channel.send({content: `No tienes el permiso suficiente para usar este comando`,ephemeral: true});
          const bot = message.guild.members.cache.get(client.user.id);
          const permsb = bot.permissions.has("Administrator");
          if(!permsb) message.channel.send("bot sin permisos");
              
         
              const valor = parseInt(args[0]);
              if(!valor) return message.reply("Inegresa un valor valido entre el 0 y el 100")
              message.channel.bulkDelete(valor + 1, true);
              if(valor >= 100 ){
                return message.reply("No se puede pasar de 100 mensajes borrados");
              }
              if(valor <= 0 ){
                return message.reply("Inegresa un valor valido entre el 0 y el 100");
              }
              const ClearCommandembed = new EmbedBuilder()
             .setDescription(`Se han eliminado una cantidad de ${valor} de mensajes`)
             .setImage("https://cdn.discordapp.com/attachments/1050475265052127243/1063703219198496860/asd.jpg")
             .setColor("#4D00FF")
        
             setTimeout(()=>{
              message.channel.send({ embeds: [ClearCommandembed] })
              .then((msg) => {
                setTimeout(() => { msg.delete() }, 5000);
             }, 4000);
              
        });
            }catch(e){console.log(String(e.stack))
              const channel = client.channels.cache.get('1087093972700250284');
            channel.send({ embeds: [new EmbedBuilder()
                  .setColor(config.wrongcolor)
                  .setFooter({text: client.user.tag})
                  .setTitle(`❌ ERROR | Un error a ocurrido`)
                  .setTimestamp()
                  .setDescription(`\`\`\`${e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``)], fetchReply: true })}
            }}

module.exports = Example;

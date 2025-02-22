const Client = require("@client");
const { PrefixCommands } = require("@models");
const { Message,EmbedBuilder } = require("discord.js");

/**
 * Clase para representar un ejemplo de comando de prefijo.
 * @extends PrefixCommands
 */
class Example extends PrefixCommands {
    constructor(){
        super({
            name: "demote"
        });
    };

    /**
     * Ejecuta la lógica asociada al comando de prefijo.
     * @param {Client} client - El cliente Discord.js.
     * @param {Message<boolean>} message - El mensaje que activó el comando.
     * @param {string[]} args - Los argumentos del comando.
     */
    run(client, message, args) {
     // Verificamos que el usuario haya mencionado un rol
     const role = message.mentions.roles.first();
     if (!role) {
         return message.reply('Debes mencionar un rol.');
     }

     // Verificamos que el usuario haya mencionado
     const user = message.mentions.users.first();
     if (!user) {
         return message.reply('Debes mencionar a un usuario.');
     }

     // Verificamos que se haya proporcionado un mensaje
     const userMessage = args.slice(2).join(' ');
     if (!userMessage) {
         return message.reply('Debes proporcionar un mensaje.');
     }

    
    const currentDate = new Date();

    // Obtener día, mes y año
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Los meses comienzan desde 0, así que sumamos 1
    const year = currentDate.getFullYear().toString().slice(0); // Obtener los últimos dos dígitos del año

    // Formatear la fecha en dd/mm/aa
    const formattedDate = `${day}/${month}/${year}`;
    const roleId = '1265781926875369572';
    // Obtén el objeto del rol
    const mentionedRole = message.guild.roles.cache.get(roleId);
        // Lógica para promover al usuario
        const exampleEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ 《================》  Demotes  《==============》❌ ')
        .setURL('https://discord.gg/CTEBAUfvhK')
        .setDescription(`${user}
        Demote: ${role}
        Razón: ${userMessage}
        Fecha: ${formattedDate}`)
        .setAuthor({ name:'El equipo de administración',  iconURL:'https://cdn.discordapp.com/attachments/947617375308623903/1191124807492829204/261acdab-22eb-49f9-8c73-4d81d4802462f.png?ex=65a44c6c&is=6591d76c&hm=6b931d71490544ac561a8c7a39c0712f35e56b5d137682f269b5245db8d24226&'})
      
        .setFooter({ text:'ATT: Kingly Fenix Studios', iconURL:'https://media.discordapp.net/attachments/1080699190797139998/1187098438253432922/efb5ad73-fb2b-4791-b68a-4a08daeed3008-redmovebg-preview.png?ex=6595a692&is=65833192&hm=847b0c4ba4f48fb1f94d33cc102f2a6f0966e259c33cf8779b8e666a8142bb89&=&format=webp&quality=lossless&width=382&height=473'})
  
        .setTimestamp();
    
      const channel = client.channels.cache.get('1302494608793538590');
  
  channel.send({embeds: [exampleEmbed],content: `Bienvenido  tag ||<@${mentionedRole.toString()}>||`})

}}

module.exports = Example;
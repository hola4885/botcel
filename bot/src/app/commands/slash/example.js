const Client = require("@client");
const { SlashCommands } = require("@models");
const { CacheType, CommandInteraction } = require("discord.js");

/**
 * Clase para representar un ejemplo de comando slash.
 * @extends SlashCommands
 */
class Example extends SlashCommands {
    constructor(){
        super({
            name: "pd",
            description: "Comando para promotes desmotes",
               
        });
    };

    /**
     * Ejecuta la lógica asociada al comando slash.
     * @param {Client} client - El cliente Discord.js.
     * @param {CommandInteraction<CacheType>} int - La interacción del comando slash.
     */
    run(client, int) {
        const userMessage = int.options.getString('mensaje');
        const role = int.options.getRole('rol');
        const userTag = int.options.getUser('usuario');
        const shouldPromote = int.options.getBoolean('promote');
        const currentDate = new Date();

        // Obtener día, mes y año
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Los meses comienzan desde 0, así que sumamos 1
        const year = currentDate.getFullYear().toString().slice(-2); // Obtener los últimos dos dígitos del año

        // Formatear la fecha en dd/mm/aa
        const formattedDate = `${day}/${month}/${year}`;
        if (shouldPromote) {
            // Lógica para promover al usuario
            const exampleEmbed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('✅ 《================》  Promote  《==============》✅')
            .setURL('https://discord.gg/CTEBAUfvhK')
            .setDescription(`${user}
            Promote: ${role}
            Razón: ${userMessage}
            Fecha: ${formattedDate}`)
            .setAuthor({ name:'El equipo de administración',  iconURL:'https://cdn.discordapp.com/attachments/947617375308623903/1191124807492829204/261acdab-22eb-49f9-8c73-4d81d4802462f.png?ex=65a44c6c&is=6591d76c&hm=6b931d71490544ac561a8c7a39c0712f35e56b5d137682f269b5245db8d24226&'})
          
            .setFooter({ text:'ATT: Kingly Fenix Studios', iconURL:'https://media.discordapp.net/attachments/1080699190797139998/1187098438253432922/efb5ad73-fb2b-4791-b68a-4a08daeed3008-redmovebg-preview.png?ex=6595a692&is=65833192&hm=847b0c4ba4f48fb1f94d33cc102f2a6f0966e259c33cf8779b8e666a8142bb89&=&format=webp&quality=lossless&width=382&height=473'})
      
            .setTimestamp();
        
          const channel = client.channels.cache.get('947617367771463701');
      
      channel.send({embeds: [exampleEmbed],content: "Bienvenido  tag ||@<947617254265208892>"})         } else {
        const exampleEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('✅ 《================》  Promote  《==============》✅')
        .setURL('https://discord.gg/CTEBAUfvhK')
        .setDescription(`${user}
        Promote: ${role}
        Razón: ${userMessage}
        Fecha: ${formattedDate}`)
        .setAuthor({ name:'El equipo de administración',  iconURL:'https://cdn.discordapp.com/attachments/947617375308623903/1191124807492829204/261acdab-22eb-49f9-8c73-4d81d4802462f.png?ex=65a44c6c&is=6591d76c&hm=6b931d71490544ac561a8c7a39c0712f35e56b5d137682f269b5245db8d24226&'})
      
        .setFooter({ text:'ATT: Kingly Fenix Studios', iconURL:'https://media.discordapp.net/attachments/1080699190797139998/1187098438253432922/efb5ad73-fb2b-4791-b68a-4a08daeed3008-redmovebg-preview.png?ex=6595a692&is=65833192&hm=847b0c4ba4f48fb1f94d33cc102f2a6f0966e259c33cf8779b8e666a8142bb89&=&format=webp&quality=lossless&width=382&height=473'})
  
        .setTimestamp();
    
      const channel = client.channels.cache.get('947617367771463701');
  
  channel.send({embeds: [exampleEmbed],content: "Bienvenido  tag ||@<947617254265208892>"})  
        
        }
    }
}

module.exports = Example;

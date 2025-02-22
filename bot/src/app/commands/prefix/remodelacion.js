const Client = require("@client");
const { PrefixCommands } = require("@models");
const { Message ,EmbedBuilder } = require("discord.js");

/**
 * Clase para representar un ejemplo de comando de prefijo.
 * @extends PrefixCommands
 */
class Example extends PrefixCommands {
    constructor(){
        super({
            name: "remodelacion"
        });
    };

    /**
     * Ejecuta la lógica asociada al comando de prefijo.
     * @param {Client} client - El cliente Discord.js.
     * @param {Message<boolean>} message - El mensaje que activó el comando.
     * @param {string[]} args - Los argumentos del comando.
     */
    run(client, message, args) {
      // const guild = message.guild;

      // // Obtén los rangos que deben ver los canales
      // const rangosPermitidos = [
      //   guild.roles.cache.find((role) => role.name === '[⭐] » Usuarios «'), // Cambia 'NombreDelRango1' por el nombre real del primer rango
      // ];
      // const role = guild.roles.everyone;
      // // Filtra solo los canales que no son de categoría
      
      // // Crea un array para guardar los nombres de los canales ocultos
      // const canalesOcultos = [];
      // const channels = guild.channels;

      // // Filtrar solo los canales de texto
      // const textChannels = channels.cache.filter(channel => channel.type === 'text');
      // // Iterar sobre los canales de texto
      // message.guild.channels.cache.forEach(async (channel) => {    
      //   if (channel.type === 'text') {
      //     channel.overwritePermissions([
      //       {
      //         id: role.id,
      //         deny: ['VIEW_CHANNEL']
      //       }, 
      //        {
      //         id: rangosPermitidos.id,
      //         deny: ['VIEW_CHANNEL']
      //       }
      //     ]);
      //     console.log(channel.name);
      //     canalesOcultos.push(channel.name);
      //   }
  
      // })
      // // Itera sobre los canales filtrados
      // message.channel.send(`Se han ocultado los siguientes canales: ${canalesOcultos.join(", ")}`);


      const exampleEmbed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('Aviso importante')
      .setURL('https://discord.gg/CTEBAUfvhK')
      .setDescription('El servidor de discord ha entrado en un estado de remodelación. Estamos trabajando para mejorar la experiencia de los usuarios y añadir nuevas funciones. Por favor, sean pacientes y disculpen las molestias.')
      .setAuthor({ name:'El equipo de administración',  iconURL:'https://cdn.discordapp.com/attachments/947617375308623903/1191124807492829204/261acdab-22eb-49f9-8c73-4d81d4802462f.png?ex=65a44c6c&is=6591d76c&hm=6b931d71490544ac561a8c7a39c0712f35e56b5d137682f269b5245db8d24226&'})
      // Establece la imagen del embed
      .setThumbnail('https://media.discordapp.net/attachments/1080699190797139998/1192322011758874635/261acdab-22eb-49f9-8c73-4d814802462f-removebg-preview.png?ex=65a8a767&is=65963267&hm=f7a88cf2b1c923712ef2fb8b4cb9d456b0163d8b5ccfa913d218400b8c7083fd&=&format=webp&quality=lossless&width=497&height=468')
      .setImage('https://media.discordapp.net/attachments/1115480831021027469/1192301925304127630/9bf4c952-63db-4d56-8aa4-45f928208794.png?ex=65a894b2&is=65961fb2&hm=2f1a89e9cb953fccffa87cade543a22bb5b1eccfc000bf556a7d6a2d8d1bec9a&=&format=webp&quality=lossless&width=603&height=468')
      // Establece el pie de página del embed
      .setFooter({ text:'Gracias por su comprensión-ATT: Kingly Fenix Studios', iconURL:'https://media.discordapp.net/attachments/1080699190797139998/1187098438253432922/efb5ad73-fb2b-4791-b68a-4a08daeed3008-redmovebg-preview.png?ex=6595a692&is=65833192&hm=847b0c4ba4f48fb1f94d33cc102f2a6f0966e259c33cf8779b8e666a8142bb89&=&format=webp&quality=lossless&width=382&height=473'})

      // Establece la fecha y hora del embed
      .setTimestamp();
      // Envía un mensaje al canal donde se ejecutó el comando con los nombres de los canales ocultos
      message.channel.send(`Se han ocultado los canales`);
  
    const channel = client.channels.cache.get('1328918166390308895');

channel.send({embeds: [exampleEmbed],content: "tag || <@here> ||"})
}}

module.exports = Example;

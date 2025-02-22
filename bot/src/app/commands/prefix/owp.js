const Client = require("@client");
const { PrefixCommands } = require("@models");
const { Message, EmbedBuilder } = require("discord.js");

/**
 * Clase para representar un ejemplo de comando de prefijo.
 * @extends PrefixCommands
 */
class Example extends PrefixCommands {
    constructor(){
        super({
            name: "Ownerp"
        });
    };

    /**
     * Ejecuta la lógica asociada al comando de prefijo.
     * @param {Client} client - El cliente Discord.js.
     * @param {Message<boolean>} message - El mensaje que activó el comando.
     * @param {string[]} args - Los argumentos del comando.
     */
    async run(client, message, args) {
        const taggedUser = message.mentions.users.first();
      const user = await message.guild.members.fetch(taggedUser);
      function getFormattedDate() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
      
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      }
      // Ahora puedes usar user.username para obtener el nombre del usuario
      const embedMsg = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('¡Promoción Especial!')
        .setDescription('¡Atención a todos los miembros del servidor!')
        .addFields(
          { name: "🎉 **¡Felicidades!** 🎉", value: `¡Hemos presenciado un momento épico en nuestro servidor!"` },
          { name: `>🎊 **¡ ** ${taggedUser.tag} **ha sido promovido al rango de Co-Owner!** 🎊`, value: `Es un honor anunciar que** ${taggedUser}**, uno de nuestros miembros más destacados, ha alcanzado la cima.`  },
          { name: "🌟 **Razon**", value: "**Ser leal y tomarse el tiempo de apoyar al servidor en lo que ocupe ser dedicado y buena persona tambien por estar hay cuando lo ocupamos muchas gracias por apoyarnos siempre es lo minimo que te podemos dar** 🏆" },

          { name: "🌟 **Nuevo Rango:**", value: "**Co-Owner** 🏆" },
          { name: "🕒 **Fecha de la Promoción:**", value: `${getFormattedDate()}` }
        )
        .setImage('https://media.discordapp.net/attachments/1131312674240729278/1131450298125275217/94c4fed523fd0f534db573a3821a4a45.gif')
        .setThumbnail(`${taggedUser.displayAvatarURL({ dynamic: true })}`)
        .setFooter({  text:'¡Este es solo el comienzo de una emocionante travesía en nuestro servidor!', iconURL:'https://media.discordapp.net/attachments/1115480831021027469/1130627431460520136/avs.png?width=840&height=473'})
        .setTimestamp();
        const CHANNEL_ID = '1328918166390308895';

        const serverChannel = await client.channels.fetch(CHANNEL_ID);

		if (taggedUser) {
		  // Envía el mensaje embed al usuario mencionado por mensaje directo

		  const userDM = await taggedUser.createDM();
		  await userDM.send({ embeds: [embedMsg] });
  
		  // Si deseas enviar también un mensaje en el canal actual donde se invocó el comando:
		  await message.reply(`¡Revisa tu MD para ver la emocionante noticia enviada a ${taggedUser}!`);
		} else {
		  // Si no se mencionó ningún usuario, muestra un mensaje de error
		  await message.reply("Debes mencionar a un usuario para enviarle la promoción.");
		}
  
      // Envía el mensaje embed al canal donde se ejecutó el comando
      const SERVER_ID = '1328581555077120081';
      // Envía el mensaje embed al usuario promovido por mensaje directo
      const userDM = await user.user.createDM();
      await userDM.send({ embeds: [embedMsg] });
		  await serverChannel.send({ embeds: [embedMsg] });

      // Enviar el mensaje al canal específico
      await serverChannel.send('hola xd');
    } catch (e) {
      console.log(String(e.stack));
      const channel = client.channels.cache.get('1087093972700250284');
      channel.send({
        embeds: [new EmbedBuilder()
          .setColor(config.wrongcolor)
          .setFooter({ text: client.user.tag })
          .setTitle(`❌ ERROR | Un error ha ocurrido`)
          .setTimestamp()
          .setDescription(`\`\`\`${e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``)
        ], fetchReply: true
      });
    }
  
    }

module.exports = Example;

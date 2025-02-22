const Client = require("@client");
const { PrefixCommands } = require("@models");
const { Message } = require("discord.js");
const { EmbedBuilder } = require('discord.js');
/**
 * Clase para representar un ejemplo de comando de prefijo.
 * @extends PrefixCommands
 */
class Example extends PrefixCommands {
    constructor(){
        super({
            name: "cm"
        });
    };

    /**
     * Ejecuta la lógica asociada al comando de prefijo.
     * @param {Client} client - El cliente Discord.js.
     * @param {Message<boolean>} message - El mensaje que activó el comando.
     * @param {string[]} args - Los argumentos del comando.
     */
    run(client, message, args) {

        const embed = new EmbedBuilder()
          .setColor('#3498DB') // Azul claro, puedes cambiar el color según tu preferencia
          .setTitle('¡Reapertura del Servidor!')
          .setAuthor({  name: '★彡 AstroVerse ★彡', iconURL:'https://media.discordapp.net/attachments/947617375308623903/1191122615482462260/image.png?ex=65a44a61&is=6591d561&hm=0f26da2bbb5b8f40476e7a67f69b9317bb61eeb3e9bca50320ff84a5a804b8ee&=&format=webp&quality=lossless',url: 'https://discord.gg/Qn6yNXrSQf'}) 
          .setDescription('\uD83C\uDF38ꗥ～¡Estamos emocionados de anunciar la reapertura de nuestro servidor! Después de trabajos intensivos y mejoras, estamos listos para dar la bienvenida de nuevo a todos nuestros miembros.～ꗥ\uD83C\uDF38')
          .addFields(
            // { name: '╔══════════════════════════════════════════════════════════╗', value: ' ' },
            { name: 'Fecha de Reapertura', value: 'Proximamente' },
            { name: '──────────────────────────────────────────────────────────', value: ' ' },
                    { name: 'ⲯ﹍︿﹍︿﹍ \uD835Horario\uDE98 ﹍ⲯ﹍ⲯ﹍︿﹍☼', value: '10:00 AM - 8:00 PM (UTC)' },
            { name: '──────────────────────────────────────────────────────────', value: ' ' },

            { name: '❤ \uD835¡Esperamos verte pronto en el servidor!\uDC28 ❤', value: ' '},
            { name: '──────────────────────────────────────────────────────────', value: ' ' },

            { name: '꧁༺ \uD835Novedades \uDCF8 ༻꧂', value: 'Hemos agregado nuevas funciones, corregido errores y mejorado la estabilidad del servidor. ¡Esperamos que disfruten de la experiencia mejorada  '},
            // { name: ' ║ ╚══════════════════════════════════════════════════════════╝', value: ' ' },


        )
          .setTimestamp()
          .setFooter( {text: ' ⚜️ Kingly Fenix Studios ⚜️', iconURL: 'https://media.discordapp.net/attachments/1080699190797139998/1187098438253432922/efb5ad73-fb2b-4791-b68a-4a08daeed3008-redmovebg-preview.png?ex=6595a692&is=65833192&hm=847b0c4ba4f48fb1f94d33cc102f2a6f0966e259c33cf8779b8e666a8142bb89&=&format=webp&quality=lossless&width=382&height=473'}); 
        
          message.channel.send({ embeds: [embed] });
        
    }
}

module.exports = Example;

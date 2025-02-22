const Client = require("@client");
const { PrefixCommands } = require("@models");
const { Message, EmbedBuilder, ActionRowBuilder, StringSelectMenuOptionBuilder, StringSelectMenuBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");

const db = new QuickDB();

/**
 * Clase para representar un ejemplo de comando de prefijo.
  * @extends PrefixCommands
   */
class Tikets extends PrefixCommands {
    constructor() {
        super({
            name: "tikets"
        });
    };

    /**
         * Ejecuta la lógica asociada al comando de prefijo.
              * @param {Client} client - El cliente Discord.js.
                   * @param {Message<boolean>} message - El mensaje que activó el comando.
                        * @param {string[]} args - Los argumentos del comando.
                             */
    async run(client, message, args) {
        try {
          
            const select = new StringSelectMenuBuilder()
                .setCustomId('celunyx_tk')
                .setPlaceholder('¿Tu problema merece nuestra atención? Escoge algo.')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Bug/Error')
                        .setDescription('¿Algo no funciona? Pues qué sorpresa. Reporta el desastre.')
                        .setEmoji("📛")
                        .setValue('tkBugError'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Soporte General')
                        .setDescription('Pide ayuda... aunque a veces parece que nosotros la necesitamos más.')
                        .setEmoji("🎟")
                        .setValue('tkSoporteGeneral'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Compras')
                        .setDescription('¿Pagaste y no recibiste nada? Qué inesperado. Reporta aquí.')
                        .setEmoji("💰")
                        .setValue('tkCompras'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Reporte')
                        .setDescription('Denuncia a alguien. Sin juicios, solo caos.')
                        .setEmoji("⚠️")
                        .setValue('tkReporte'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Postular a Streamer')
                        .setDescription('¿Crees que tienes carisma? Postúlate para el rol de Streamer.')
                        .setEmoji("🎥")
                        .setValue('tkPostularStreamer'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Postular a YouTuber')
                        .setDescription('¿Eres el próximo hit de YouTube? Postúlate para el rol.')
                        .setEmoji("📹")
                        .setValue('tkPostularYouTuber'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Postular a Otro Usuario')
                        .setDescription('Nombra a alguien más, porque no eres tú, ¿verdad?')
                        .setEmoji("👤")
                        .setValue('tkPostularOtroUsuario'),
                );

            const row = new ActionRowBuilder()
                .addComponents(select);

            const embed = new EmbedBuilder()
                .setColor('#0a0a0a')
                .setTitle('✨ Sistema de Tickets - Celunyx  ✨')
                .setDescription(`
¿Tienes un problema? ¡Qué sorpresa! En Celunyx  estamos aquí para arreglarlo (o al menos intentarlo). 
Selecciona una opción del menú si crees que tu caso merece atención.
                `)
                .addFields(
                    { name: '¿Cómo crear un ticket?', value: 'Pulsa el botón de abajo. No es tan difícil, ¿verdad?' },
                    { name: '¿Quién responderá?', value: 'Un valiente del Equipo Administrativo. No los hagas arrepentirse.' },
                    { name: '¿Qué pasa si no respondo?', value: 'Te damos 24 horas. Después, adiós ticket.' },
                )
                .setThumbnail('https://media.discordapp.net/attachments/1080699190797139998/1331420609107988480/Imagen_de_WhatsApp_2025-01-21_a_las_16.56.31_4a9b8b7c-removebg-preview.png?ex=67918d91&is=67903c11&hm=a0f2d54964c417b9d20187deb2ab4d35e79be4f683f58d72cdf3b4c494dbc8e5&=&format=webp&quality=lossless&width=468&height=468')

                .setImage("https://media.discordapp.net/attachments/1330691603698024488/1331427816784269383/Doradito.png?ex=67919448&is=679042c8&hm=2a4e99264f645e6ca4821c934d7c329ffd9053c79f72d0d6801fa2b50031ece6&=&format=webp&quality=lossless&width=1025&height=269") // Actualiza la URL al logo
                .setFooter({ text: '© 2020 KinglyFenix Studios. Todos los derechos reservados.',         
                  iconURL: "https://media.discordapp.net/attachments/1080699190797139998/1331739596312150047/logo2.png?ex=6792b6a6&is=67916526&hm=c5941d9bb3098be160874c27e1e1f2f9fb4815e6964f8dc6c398909a83176f43&=&format=webp&quality=lossless&width=283&height=350", // Icono del emoji Sradmin
                })
                .setTimestamp();

            await message.reply({ content: "El panel ha sido enviado con éxito.", ephemeral: true });

            await message.channel.send({
                embeds: [embed],
                components: [row],
                content: ""
            });
        } catch (e) {
            console.log(String(e.stack));
        }
    }
}

module.exports = Tikets;
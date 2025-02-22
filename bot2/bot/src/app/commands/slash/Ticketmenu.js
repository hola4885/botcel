const { SlashCommands } = require("@models");
const { Client, CommandInteraction, EmbedBuilder, ChannelType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require("discord.js");

/**
 * Clase para representar el comando slash de anuncio.
 * @extends SlashCommands
 */
class Anuncio extends SlashCommands {
    constructor() {
        super({
            name: "celunyx",
            description: "Manda el panel de tickets.",
            options: [
                {
                    type: 7, // CHANNEL type
                    name: 'canal',
                    description: 'Canal donde se enviará el anuncio.',
                    required: true,
                }
            ]
        });
    }

    /**
     * Ejecuta la lógica asociada al comando slash.
     * @param {Client} client - El cliente Discord.js.
     * @param {CommandInteraction<CacheType>} int - La interacción del comando slash.
     */
    async run(client, int) {
        try {
            const channel = int.options.getChannel('canal');
            if (channel.type !== ChannelType.GuildText) {
                return int.reply({ content: 'Oh vaya, ¿era tan difícil seleccionar un canal de texto válido? Intenta otra vez.', ephemeral: true });
            }

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
¿Tienes un problema? ¡Qué sorpresa! En Celunyx Studios estamos aquí para arreglarlo (o al menos intentarlo). 
Selecciona una opción del menú si crees que tu caso merece atención.
                `)
                .addFields(
                    { name: '¿Cómo crear un ticket?', value: 'Pulsa el botón de abajo. No es tan difícil, ¿verdad?' },
                    { name: '¿Quién responderá?', value: 'Un valiente del Equipo Administrativo. No los hagas arrepentirse.' },
                    { name: '¿Qué pasa si no respondo?', value: 'Te damos 24 horas. Después, adiós ticket.' },
                )
                .setImage("https://media.discordapp.net/attachments/1080699190797139998/1331420609632014388/Imagen_de_WhatsApp_2025-01-21_a_las_16.56.31_4a9b8b7c.jpg?ex=67918d91&is=67903c11&hm=195c5139bb246bef05f332045ec5c1d7d3ea9bca5d38e30c42c3f89afd2643fa&=&format=webp&width=468&height=468") // Actualiza la URL al logo
                .setFooter({ text: 'Solo usa esto si es urgente. O si quieres molestarnos.', iconURL: client.user.displayAvatarURL() })
                .setTimestamp();

            await int.reply({ content: "El panel fue enviado. Veamos cuánto tardas en usarlo.", ephemeral: true });

            await channel.send({
                embeds: [embed],
                components: [row],
                content: ""
            });
        } catch (error) {
            console.error("Error enviando anuncio:", error);
            return int.reply({ content: "Ups, algo salió mal. Intenta otra vez, si tienes suerte.", ephemeral: true });
        }
    }
}

module.exports = Anuncio;

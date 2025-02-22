const Client = require("@client");
const { Buttons } = require("@models");
const {
    ButtonInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ButtonBuilder,
    CacheType,
} = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const regp = require('./../../../../mongodb/models/problemaA');
const config = require('../../../../cnf/config.json');

class Example extends Buttons {
    constructor() {
        super("delete_ticket");
    }

    async run(client, int) {
        const preguntaId = int.message.embeds[0].footer.text.slice(11);
        const data = await regp.findById(preguntaId);

        if (!data) {
            return int.reply({
                content: "❌ *Oh, parece que el ticket se esfumó como un sueño olvidado... No se encontró la información. ¿Intentaste no romper el sistema?*",
                ephemeral: true,
            });
        }

        // Obtener el usuario que creó el ticket
        const ticketOwner = await client.users.fetch(data.author);

        // Obtener el canal específico por ID desde la configuración o datos
        const channelId = config.ticketChannelId || data.tiketid; // Asegúrate de definir ticketChannelId en tu configuración
        const channel = await client.channels.fetch(channelId).catch(() => null);

        if (!channel) {
            return int.reply({
                content: "❌ *Genial, parece que el canal para enviar la calificación decidió desaparecer... ¿Estabas esperando esto?*",
                ephemeral: true,
            });
        }

        // Crear embed con mensajes adaptados al tono
        const embed = new EmbedBuilder()
            .setColor("#00ff7f")
            .setFooter({ text: `ID del Ticket: ${preguntaId}` })
            .setTitle('📊 Calificación del Ticket')
            .setTimestamp()
            .setThumbnail('https://media.discordapp.net/attachments/1080699190797139998/1331420609107988480/Imagen_de_WhatsApp_2025-01-21_a_las_16.56.31_4a9b8b7c-removebg-preview.png?ex=67918d91&is=67903c11&hm=a0f2d54964c417b9d20187deb2ab4d35e79be4f683f58d72cdf3b4c494dbc8e5&=&format=webp&quality=lossless&width=468&height=468')
            .setImage(
                "https://media.discordapp.net/attachments/1330691603698024488/1331428229424087040/Verificar.png?ex=679194aa&is=6790432a&hm=0c6c68d4b36c616037fafb983c15965bebfa3af056cc6d35a8e042e0ae66c8e4&=&format=webp&quality=lossless&width=1025&height=270"
            )
            .setDescription(
                `¡Hola, <@${ticketOwner.id}>! 🙌  
                
                *¿Ya estás listo para desplegar tu infinita sabiduría?*  
                Por favor, selecciona un número del **1 al 5** para calificar la atención recibida en este ticket.  
                *(Sí, sabemos que lo harás con toda la objetividad del mundo... ¡o eso esperamos! 🙄)*`
            );

        // Crear botón
        const button = new ButtonBuilder()
            .setCustomId('calf')
            .setLabel('Calificar')
            .setStyle(ButtonStyle.Primary);

        const actionRow = new ActionRowBuilder().addComponents(button);

        // Enviar embed al canal especificado
        try {
            await channel.send({
                content: `<@${ticketOwner.id}>, *oh gran crítico, te convocamos para que emitas tu veredicto...*`,
                embeds: [embed],
                components: [actionRow],
            });

            return int.reply({
                content: "✅ *Se ha enviado el mensaje de calificación. Si algo falla, no es culpa nuestra, ¿ok?*",
                ephemeral: true,
            });
        } catch (error) {
            console.error("Error al enviar el mensaje de calificación:", error);
            return int.reply({
                content: "❌ *Ups, algo salió mal al enviar la calificación... ¿Por qué siempre pasa lo inesperado contigo?*",
                ephemeral: true,
            });
        }
    }
}

module.exports = Example;

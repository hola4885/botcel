const Client = require("@client");
const { PrefixCommands } = require("@models");
const { Message, ButtonBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");

const db = new QuickDB();

/**
 * Clase para representar un ejemplo de comando de prefijo.
 * @extends PrefixCommands
 */
class Tikets extends PrefixCommands {
    constructor() {
        super({
            name: "tiketst"
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
            const embed = new EmbedBuilder()
                .setColor("#5865F2") // Color azul acorde al tema de Discord
                .setTitle("¡Bienvenido al Sistema de Tickets de Astro Verse! 🎉")
                .setDescription(
                    `¡Gracias por utilizar nuestro sistema de tickets! Aquí puedes solicitar asistencia, reportar problemas o hacer sugerencias. A continuación, te explicamos cómo funciona:`
                )
                .addFields(
                    {
                        name: "📌 **¿Qué es esto?**",
                        value: "Es un sistema de tickets diseñado para que el personal de **Celunyx** pueda comunicarse de manera directa y organizada con los superiores.",
                    },
                    {
                        name: "📋 **¿Cómo funciona?**",
                        value: "1. Haz clic en el botón **'Crear Ticket'** para abrir un nuevo ticket.\n2. Describe tu consulta, queja o sugerencia en el canal que se creará.\n3. Un miembro del equipo te responderá lo antes posible.",
                    },
                    {
                        name: "📜 **Tipos de Tickets**",
                        value: "> - **CONSULTAS/DUDAS**\n> - **QUEJAS PERSONAL**\n> - **SUGERENCIAS**",
                    },
                    {
                        name: "⚠️ **Aviso Importante**",
                        value: "Por favor, utiliza este sistema con responsabilidad. Cualquier uso inadecuado será penalizado.",
                    }
                )
                .setThumbnail('https://media.discordapp.net/attachments/1080699190797139998/1331420609107988480/Imagen_de_WhatsApp_2025-01-21_a_las_16.56.31_4a9b8b7c-removebg-preview.png?ex=67918d91&is=67903c11&hm=a0f2d54964c417b9d20187deb2ab4d35e79be4f683f58d72cdf3b4c494dbc8e5&=&format=webp&quality=lossless&width=468&height=468')
                .setImage("https://media.discordapp.net/attachments/1330691603698024488/1331427816784269383/Doradito.png?ex=67919448&is=679042c8&hm=2a4e99264f645e6ca4821c934d7c329ffd9053c79f72d0d6801fa2b50031ece6&=&format=webp&quality=lossless&width=1025&height=269")
                .setFooter({
                    text: "Atentamente: Equipo de Administración de Celunyx",
                    iconURL: "https://media.discordapp.net/attachments/1080699190797139998/1331739596312150047/logo2.png?ex=6792b6a6&is=67916526&hm=c5941d9bb3098be160874c27e1e1f2f9fb4815e6964f8dc6c398909a83176f43&=&format=webp&quality=lossless&width=283&height=350",
                });

            // Crear un botón
            const button = new ButtonBuilder()
                .setCustomId("Ticket_Staffs")
                .setLabel("Crear Ticket")
                .setEmoji("🎫") // Emoji más representativo
                .setStyle(ButtonStyle.Success); // Cambiar a un estilo más llamativo

            // Crear una fila de componentes
            const row = new ActionRowBuilder().addComponents(button);

            await message.channel.send({
                embeds: [embed],
                components: [row],
                content: ""
            });
            message.delete;
        } catch (e) {
            console.log(String(e.stack));
        }
    }
}

module.exports = Tikets;
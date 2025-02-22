const Client = require("@client");
const { Buttons } = require("@models");
const { ButtonInteraction, CacheType } = require("discord.js");
const { ModalSubmitInteraction, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { QuickDB } = require("quick.db");
const staff = require('./../../../../mongodb/models/problemaS');
const db = new QuickDB();

/**
 * Clase para representar un ejemplo de botón interactivo.
 * @extends Buttons
 */
class Examplse extends Buttons {
    constructor() {
        super("Ticket_Staffs");
    }

    /**
     * Ejecuta la lógica asociada al botón interactivo.
     * @param {Client} client - El cliente Discord.js.
     * @param {ButtonInteraction<CacheType>} int - La interacción del botón.
     */
    async run(client, int) {
        let auth = int.user.id;

        // Verificar si ya existe un ticket abierto por el usuario
        const canales = int.guild.channels.cache.filter(c => c.name === `ticket-${int.user.username}`);
        if (canales.size > 0) {
            const canal = await staff.findOne({ author: auth });
            return int.reply({ content: `Ya tienes un ticket abierto <#${canal.tiketid}>`, ephemeral: true });
        }

        // Obtener la categoría del ticket
        const categoryId = await db.get(`tickets_category_${int.guild.id}`);
        if (!categoryId) {
            return int.reply({
                content: "No se ha definido ninguna categoría para los tickets. Usa el comando `/set-category <categoryId>` para definirla.",
                ephemeral: true
            });
        }

        const categoryChannel = int.guild.channels.cache.get(categoryId);
        if (!categoryChannel || categoryChannel.type !== 4) {
            return int.reply({
                content: "La categoría definida no es válida. Usa el comando `/set-category <categoryId>` para definir una nueva.",
                ephemeral: true
            });
        }

        const everyone = int.guild.roles.cache.find((rol) => rol.name === '@everyone');
        const role = int.guild.roles.cache.find(role => role.name === 'Staff-Tickets');
        const usu = int.guild.roles.cache.find(role => role.name === 'Equipo personal');

        // Crear el canal del ticket
        const channel = await int.guild.channels.create({
            name: `ticket-${int.member.user.username}`,
            parent: categoryId,
            permissionOverwrites: [
                { id: everyone.id, deny: ["ViewChannel"] },
                { id: usu.id, deny: ["ViewChannel"] },
                { id: role.id, allow: ["ViewChannel"], deny: ["SendMessages"] },
                { id: int.member.id, allow: ["ViewChannel"], allow: ["SendMessages"] }
            ],
            reason: `Ticket creado para ${int.user.tag}`,
            topic: `${int.member.user.username}`,
        });

        // Guardar el ticket en la base de datos
        let data = await staff.findOne({ author: auth });
        let savedDataId;

        if (!data) {
            const newData = new staff({
                message: "Descripción del ticket", // Ajusta la descripción según lo necesario
                asunt: "Asunto del ticket", // Ajusta el asunto según lo necesario
                prioridad: "Prioridad del ticket", // Ajusta la prioridad según lo necesario
                author: int.user.id,
                tiketid: channel.id
            });
            const savedData = await newData.save();
            savedDataId = savedData._id;
        } else {
            const updatedData = await staff.findOneAndUpdate(
                { author: auth },
                {
                    message: "Descripción del ticket", // Ajusta la descripción según lo necesario
                    asunt: "Asunto del ticket", // Ajusta el asunto según lo necesario
                    prioridad: "Prioridad del ticket", // Ajusta la prioridad según lo necesario
                    author: int.user.id,
                    tiketid: channel.id
                },
                { new: true }
            );
            savedDataId = updatedData._id;
        }

        await int.reply({ content: `Ticket creado con éxito <#${channel.id}>`, ephemeral: true });

        // Crear el embed inicial del ticket
        const Embed = new EmbedBuilder()
            .setAuthor({ name: `${int.user.tag}`, iconURL: int.user.displayAvatarURL({ dynamic: true }) })
            .setTitle(`🎟️ Ticket de ${int.user.tag}`)
            .setDescription("🎉 **¡Ticket creado con éxito!**\n\nGracias por abrir un ticket. Nuestro equipo de moderacion estará contigo en breve. Mientras esperas, uno de nuestros Sr. Moderadores o Administradores estará revisando tu caso.")
            .setThumbnail(int.user.displayAvatarURL({ dynamic: true }))
            .setImage("https://media.discordapp.net/attachments/1330691603698024488/1331427816784269383/Doradito.png?ex=67919448&is=679042c8&hm=2a4e99264f645e6ca4821c934d7c329ffd9053c79f72d0d6801fa2b50031ece6&=&format=webp&quality=lossless&width=1025&height=269") // Sustituye con el logo de Celunyx           
            .addFields(
                { name: "📄 **Asunto**", value: "Asunto del ticket", inline: false },
                { name: "📜 **Descripción**", value: "Descripción del ticket", inline: false },
                { name: "👥 **Tags**", value: `🔹 ${role} 🔹 ${int.user}` },
                { name: "💼 **Equipo de soporte**", value: "Un Moderador o Sr. Moderador se pondrá en contacto contigo pronto para asistir con el ticket." }
            )
            .setColor(0x00AE86)
            .setFooter({ text: `ID Ticket: ${savedDataId}`, iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        // Crear el botón de cerrar ticket para el staff
        const Boton = new ButtonBuilder()
            .setCustomId("cerrartks")
            .setLabel("🎟️ Cerrar Ticket")
            .setEmoji('🎟️')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents([Boton]);

        // Enviar mensaje de ticket creado con el botón para cerrar
        await channel.send({
            embeds: [Embed],
            components: [row],
            content: `🔔 **Nuevo Ticket Abierto**\n${role} ${int.user}, tu ticket está listo para ser atendido por un Moderador o Sr. Moderador.`
        });
    }
}

module.exports = Examplse;

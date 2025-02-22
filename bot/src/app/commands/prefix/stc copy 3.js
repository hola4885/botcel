const Client = require("@client");
const { PrefixCommands } = require("@models");
const { Message, EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

class SetCategory extends PrefixCommands {
    constructor(){
        super({
            name: "set-category-staff"
        });
    }

    async run(client, message, args) {
        if (!message.member.permissions.has("MANAGE_CHANNELS")) {
            return message.reply("No tienes permisos para usar este comando.");
        }

        const categoryId = args[0];
        if (!categoryId) {
            return message.reply("Por favor, proporciona el ID de la categoría.");
        }

        const categoryChannel = message.guild.channels.cache.get(categoryId);
        if (!categoryChannel || categoryChannel.type !== 4) { // Verificar si es una categoría
            return message.reply("Por favor, proporciona un ID de categoría válido.");
        }

        // Guardar el ID de la categoría en la base de datos
        await db.set(`staffn_${message.guild.id}`, categoryId);

        const embed = new EmbedBuilder()
            .setTitle("Categoría de Tickets Definida")
            .setDescription(`La nueva categoría para los staffs es <#${categoryId}>.`)
            .setColor("Green");

        message.reply({ embeds: [embed] });
    }
}

module.exports = SetCategory;

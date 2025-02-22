const Client = require("@client");
const { PrefixCommands } = require("@models");
const { Message, EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

class SetCategory extends PrefixCommands {
    constructor(){
        super({
            name: "set-logs"
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
const channel = message.guild.channels.cache.get(categoryId);

// Verificar que el canal existe y es del tipo texto
if (!channel || channel.type !== 0) { // `0` corresponde a un canal de texto
    return message.reply("Por favor, proporciona un ID de canal de texto válido.");
}

        // Guardar el ID de la categoría en la base de datos
        await db.set(`log_channel_${message.guild.id}`, channel);

        const embed = new EmbedBuilder()
            .setTitle("Categoría de Tickets Definida")
            .setDescription(`La nueva categoría para los tickets es <#${categoryId}>.`)
            .setColor("Green");

        message.reply({ embeds: [embed] });
    }
}

module.exports = SetCategory;
const Client = require("@client");
const { PrefixCommands } = require("@models");
const { Message } = require("discord.js");
const mongoose = require('mongoose');
const Sanciones = require("./../../../../../../mongodb/models/sanciones");
const nuevostaff = require("./../../../../../../mongodb/models/nuevostaff");

class Kick extends PrefixCommands {
    constructor() {
        super({
            name: "kick",
            alias: ["expulsar"],
            roles: ["123456789012345678", "987654321098765432"], // IDs de roles permitidos
        });
    }

    async run(client, message, args) {
        const member = message.mentions.members.first();
        if (!member) return message.reply("Por favor, menciona al usuario que deseas kickear.");
        const reason = args.slice(1).join(" ") || "No se proporcionó razón.";

        const sancion = new Sanciones({
            sancion: 'kick',
            duracion: 'N/A',
            razon: reason,
            usuarioid: member.id,
            staffid: message.author.id,
        });
        await sancion.save(); // Guardar la sanción en la base de datos

        member.kick(reason)
            .then(async () => {
                message.channel.send(`${member.user.tag} fue kickeado. Razón: ${reason}`);

                // Notificar al staff
                const staffData = await nuevostaff.findOne({ staff: message.author.id });
                if (!staffData) {
                    return message.reply("No se encontró un canal asignado a tu staff.");
                }

                const channel = client.channels.cache.get(staffData.tiketid);
                if (!channel) {
                    return message.reply("No se pudo encontrar el canal asignado.");
                }
                channel.send(`El usuario ${member.user.tag} fue kickeado por ${message.author.tag}. Razón: ${reason}`);
            })
            .catch(err => message.channel.send("No se pudo kickear al usuario. Verifica los permisos."));
    }
}

module.exports = Kick;

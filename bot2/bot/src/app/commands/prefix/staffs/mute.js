const Client = require("@client");
const { PrefixCommands } = require("@models");
const { Message } = require("discord.js");
const nuevostaff = require('./../../../../../../mongodb/models/nuevostaff'); // El modelo de tu base de datos
const Sanciones = require("./../../../../../../mongodb/models/sanciones");

/**
 * Comando para mutear a un usuario.
 * @extends PrefixCommands
 */
class Mute extends PrefixCommands {
    constructor() {
        super({
            name: "mute",
            alias: ["silenciar"],
            roles: ["123456789012345678", "987654321098765432"],
        });
    }

    async run(client, message, args) {
        const member = message.mentions.members.first();
        if (!member) return message.reply("Por favor, menciona al usuario que deseas mutear.");
        const muteRole = message.guild.roles.cache.find(role => role.name === "Muted");
        if (!muteRole) return message.channel.send("No se encontró el rol 'Muted'. Por favor, crea uno.");
        const reason = args.slice(1).join(" ") || "No se proporcionó razón.";

        const sancion = new Sanciones({
            sancion: 'mute',
            duracion: 'Indefinido',
            razon: reason,
            usuarioid: member.id,
            staffid: message.author.id,
        });
        await sancion.save();

        member.roles.add(muteRole)
            .then(async () => {
                message.channel.send(`${member.user.tag} fue silenciado.`);

                const staffData = await nuevostaff.findOne({ staff: message.author.id });
                if (!staffData) {
                    return message.reply("No se encontró un canal asignado a tu staff.");
                }

                const channel = client.channels.cache.get(staffData.tiketid);
                if (!channel) {
                    return message.reply("No se pudo encontrar el canal asignado.");
                }
                channel.send(`El usuario ${member.user.tag} fue silenciado por ${message.author.tag}. Razón: ${reason}`);
            })
            .catch(err => message.channel.send("No se pudo silenciar al usuario. Verifica los permisos."));
    }
}

module.exports = Mute;


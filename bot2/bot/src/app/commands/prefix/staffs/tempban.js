const ms = require("ms");
const Client = require("@client");
const { PrefixCommands } = require("@models");
const { Message } = require("discord.js");
const Sanciones = require("./../../../../../mongodb/models/sanciones");
const nuevostaff = require("./../../../../../mongodb/models/nuevostaff");
class Tempban extends PrefixCommands {
    constructor() {
        super({
            name: "tempban",
            alias: ["bantemporal"],
            roles: ["123456789012345678", "987654321098765432"],
        });
    }

    async run(client, message, args) {
        const member = message.mentions.members.first();
        if (!member) return message.reply("Por favor, menciona al usuario que deseas banear temporalmente.");
        const duration = args[1];
        if (!duration || isNaN(ms(duration))) {
            return message.reply("Por favor, especifica la duración del baneo (por ejemplo: `1d`, `5h`).");
        }
        const reason = args.slice(2).join(" ") || "No se proporcionó razón.";

        const sancion = new Sanciones({
            sancion: "tempban",
            duracion: duration,
            razon: reason,
            usuarioid: member.id,
            staffid: message.author.id,
        });
        await sancion.save();

        member.ban({ reason })
            .then(async () => {
                message.channel.send(`${member.user.tag} fue baneado temporalmente por ${duration}. Razón: ${reason}`);

                // Desbanear automáticamente después de la duración especificada
                setTimeout(async () => {
                    await message.guild.members.unban(member.id);
                    message.channel.send(`${member.user.tag} ha sido desbaneado automáticamente.`);
                }, ms(duration));
            })
            .catch(err => message.channel.send("No se pudo banear al usuario. Verifica los permisos."));
    }
}

module.exports = Tempban;

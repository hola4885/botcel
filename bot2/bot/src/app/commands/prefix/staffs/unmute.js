const { MessageEmbed } = require("discord.js");
const { PrefixCommands } = require("@models");
const nuevostaff = require('../../../../../../../mongodb/models/nuevostaff'); // El modelo de tu base de datos
const Sanciones = require("../../../../../../../mongodb/models/sanciones");
/**
 * Comando para desmutear a un usuario.
 * @extends PrefixCommands
 */
class Unmute extends PrefixCommands {
    constructor() {
        super({
            name: "unmute",
            alias: ["desmutear"],
            roles: ["123456789012345678", "987654321098765432"], // IDs de roles permitidos
        });
    }

    run(client, message, args) {
        const member = message.mentions.members.first();
        if (!member) return message.reply("Por favor, menciona al usuario que deseas desmutear.");
        const muteRole = message.guild.roles.cache.find(role => role.name === "Muted");
        if (!muteRole) return message.channel.send("No se encontró el rol 'Muted'.");
        member.roles.remove(muteRole)
            .then(() => message.channel.send(`${member.user.tag} fue desmuteado.`))
            .catch(err => message.channel.send("No se pudo desmutear al usuario. Verifica los permisos."));
    }
}

module.exports = Unmute;
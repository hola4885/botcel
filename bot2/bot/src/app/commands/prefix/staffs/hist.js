const { EmbedBuilder } = require("discord.js");
const { PrefixCommands } = require("@models");
const Sanciones = require("./../../../../../../mongodb/models/sanciones");
const nuevostaff = require("./../../../../../../mongodb/models/nuevostaff");

class History extends PrefixCommands {
    constructor() {
        super({
            name: "history",
            alias: ["historial"],
            roles: ["123456789012345678", "987654321098765432"], // IDs de roles permitidos
        });
    }

    async run(client, message, args) {
        const mentioned = message.mentions.users.first();
        if (!mentioned) return message.reply("Por favor, menciona a un usuario o staff para consultar su historial.");

        const staffData = await nuevostaff.findOne({ staff: mentioned.id });
        if (staffData) {
            // Historial de sanciones hechas por un staff
            const sancionesStaff = await Sanciones.find({ staffid: mentioned.id });
            if (!sancionesStaff.length) {
                return message.reply(`${mentioned.tag} no tiene sanciones registradas como staff.`);
            }

            const embed = new EmbedBuilder()
                .setTitle(`Historial de sanciones realizadas por ${mentioned.tag}`)
                .setColor("#16fff2") // Color morado, tu color favorito 💜
                .setDescription(
                    sancionesStaff
                        .map(
                            (sancion, index) =>
                                `**${index + 1}.** Usuario: <@${sancion.usuarioid}>\n- Sanción: ${sancion.sancion}\n- Razón: ${sancion.razon}\n- Duración: ${sancion.duracion || "N/A"}`
                        )
                        .join("\n\n")
                )
                .setFooter({ text: "Historial de sanciones como staff" });

            return message.channel.send({ embeds: [embed] });
        } else {
            // Historial de sanciones recibidas por un usuario
            const sancionesUsuario = await Sanciones.find({ usuarioid: mentioned.id });
            if (!sancionesUsuario.length) {
                return message.reply(`${mentioned.tag} no tiene sanciones registradas.`);
            }

            const embed = new EmbedBuilder()
                .setTitle(`Historial de sanciones de ${mentioned.tag}`)
                .setColor("#fff002")
                .setDescription(
                    sancionesUsuario
                        .map(
                            (sancion, index) =>
                                `**${index + 1}.** Staff: <@${sancion.staffid}>\n- Sanción: ${sancion.sancion}\n- Razón: ${sancion.razon}\n- Duración: ${sancion.duracion || "N/A"}`
                        )
                        .join("\n\n")
                )
                .setFooter({ text: "Historial de sanciones recibidas" });

            return message.channel.send({ embeds: [embed] });
        }
    }
}

module.exports = History;

const Client = require("@client");
const { ModalSubmit } = require("@models");
const { CacheType, ModalSubmitInteraction,EmbedBuilder } = require("discord.js");
const nuevostaff = require('./../../../../../../mongodb/models/nuevostaff');
const { QuickDB } = require("quick.db");

const db = new QuickDB();
/**
 * Clase para representar un ejemplo de modal de presentación.
 * @extends ModalSubmit
 */
class regstaff extends ModalSubmit {
    constructor(){
        super("staffn");
    };

    /**
     * Ejecuta la lógica asociada al modal de presentación.
     * @param {Client} client - El cliente Discord.js.
     * @param {ModalSubmitInteraction<CacheType>} int - La interacción del modal de presentación.
     */
   async run(client, int) { 
         const ids = int.fields.getTextInputValue("ID");
            const descripcion = int.fields.getTextInputValue("nombre");
            const carg = int.fields.getTextInputValue("carg");

            const user = await client.users.fetch(ids);
            let auth = user.id;
      
                // Verificar si ya existe un ticket abierto por el usuario
                const canales = int.guild.channels.cache.filter(c => c.name === `staff-${user.username}`);
                if (canales.size > 0) {
                    const canal = await nuevostaff.findOne({ author: auth });
                    return int.reply({ content: `Ya tienes un ticket abierto <#${canal.tiketid}>`, ephemeral: true });
                }
        
                // Obtener la categoría del ticket
                const categoryId = await db.get(`staffn_${int.guild.id}`);
                if (!categoryId) {
                    return int.reply({
                        content: "No se ha definido ninguna categoría para los tickets. Usa el comando `kf!set-category-staff <categoryId>` para definirla.",
                        ephemeral: true
                    });
                }
        
                const everyone = int.guild.roles.cache.find((rol) => rol.name === '@everyone');
                const usus = int.guild.roles.cache.find(role => role.name === 'Equipo administracion');
                const staff = int.guild.roles.cache.find(role => role.name === 'Sr.Mod');

                // Crear el canal del ticket
                const channel = await int.guild.channels.create({
                    name: `Staff-${user.username}`,
                    parent: categoryId,
                    permissionOverwrites: [
                        // Permitir acceso al staff que se especificó en el formulario
                        { id: ids, allow: ["ViewChannel", "SendMessages"] },
                        { id: user.id, allow: ["ViewChannel", "SendMessages"] },
                        { id: everyone.id, deny: ["ViewChannel"] },
                        { id: staff.id, allow: ["ViewChannel", "SendMessages"] },
                        { id: usus.id, allow: ["ViewChannel", "SendMessages"] }
                    ],
                    reason: `Canal creado para ${user.tag} (ID del staff: ${ids})`,
                    topic: `${user.username}`,
                });
                // Guardar el ticket en la base de datos
                let data = await nuevostaff.findOne({ staff: auth });
        
                if (!data) {
                    const newData = new nuevostaff({
                        staff: user.id,
                        tiketid: channel.id
                    });
                    const savedData = await newData.save();
                } else {
                    const updatedData = await nuevostaff.findOneAndUpdate(
                        { author: auth },
                        {
                            staff: user.id,
                            tiketid: channel.id
                        },
                        { new: true }
                    );
          
                }
        
                const welcomeEmbed = new EmbedBuilder()
                .setAuthor({
                    name: `${user.tag}`,
                    iconURL:user.displayAvatarURL({ dynamic: true })
                })
                .setTitle("🌟 ¡Bienvenido al canal ! 🌟")
                .setDescription("Este canal ha sido creado específicamente para coordinar y gestionar las actividades del nuevo personal. A continuación, te explicamos cómo funciona este sistema:")
                .addFields(
                    {
                        name: "🔎 **¿Cómo funciona el sistema?**",
                        value: "En este canal encontrarás un botón que te permitirá acceder a un formulario. En este formulario deberás rellenar los siguientes datos del nuevo personal:\n\n- **ID Discord** (Nuevo Personal)\n- **Nombre** (MC)\n- **Cargo** (ROL)\n\nLuego de completarlo, podrás aceptar los datos con el botón correspondiente."
                    },
                    {
                        name: "⚙️ **¿Qué sucede después de esto?**",
                        value: "Al finalizar, se creará un canal personalizado para el personal asignado. Solo el nuevo personal y el equipo de **Sr.Mod** (o superiores) tendrán acceso a este canal."
                    },
                    {
                        name: "💡 **¿Qué tiene de especial?**",
                        value: "En este canal se sincronizarán:\n- Sanciones realizadas por el equipo personal.\n- Peticiones aceptadas del canal **〢📌┇petición-soporte**.\n- Acciones automáticas del bot (baneos, expulsiones, advertencias, muteos).\n\nEs un registro dedicado a cada personal para mantener todo organizado y centralizado."
                    },
                    {
                        name: "📊 **¿Es un LOG?**",
                        value: "Sí y no. Este canal registra las actividades, pero también incluye funciones adicionales:\n- Los **Sr.Mod** podrán revisar las acciones realizadas y, si corresponde, rechazarlas. Esto afecta directamente al puntaje del personal."
                    },
                    {
                        name: "🏆 **Registro de puntaje**",
                        value: "El sistema de puntaje permitirá penalizar al personal si una acción es rechazada por un **Sr.Mod**. Este sistema fomenta la precisión y la responsabilidad en las actividades del equipo."
                    },
                    {
                        name: "⭐ **Ventajas del sistema**",
                        value: "- Personal más sincronizado y ordenado.\n- Revisión más eficiente para el equipo **Sr.Mod**.\n- Mejor manejo general del equipo personal."
                    }
                )
                .setColor(0x00AE86)
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setFooter({
                    text: "Atentamente, Equipo de administración ⭐",
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp();
            
  
            
            
            await channel.send({
                embeds: [welcomeEmbed],
                content: `👋 **¡Hola ${user}!**\nEste canal está listo para usarse. Por favor, sigue las instrucciones del mensaje para garantizar un flujo de trabajo eficiente.`
            });
            await int.reply({
                content: `✅ Creado con exito <#${channel.id}>.`,
                ephemeral: true,
              });
    };
}

module.exports = regstaff;

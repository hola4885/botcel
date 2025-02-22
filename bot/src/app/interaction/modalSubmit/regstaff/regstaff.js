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
        iconURL: user.displayAvatarURL({ dynamic: true })
    })
    .setTitle("🌟 ¡Bienvenido oficialmente al equipo de staff! 🌟")
    .setDescription(`¡Felicidades, ${user.username}! Has sido seleccionado para unirte a nuestro equipo de staff. Este canal es tu espacio personal para coordinar, aprender y crecer en tu nuevo rol. Estamos emocionados de tenerte a bordo.`)
    .addFields(
        {
            name: "📋 **Tu información registrada**",
            value: `- **ID de Discord:** ${ids}\n- **Nombre:** ${descripcion}\n- **Cargo:** ${carg}\n\nSi encuentras algún error en esta información, por favor contacta a un administrador lo antes posible.`
        },
        {
            name: "🔑 **Propósito de este canal**",
            value: "Este canal es tu centro de operaciones. Aquí podrás:\n- Recibir asignaciones y tareas.\n- Registrar sanciones, peticiones y acciones realizadas.\n- Coordinar con el equipo de administración.\n- Resolver dudas y recibir feedback."
        },
        {
            name: "📝 **Registro de actividades**",
            value: "Todas tus acciones como staff (sanciones, peticiones aceptadas, etc.) se registrarán automáticamente aquí. Esto nos ayuda a mantener un historial transparente y organizado de tu trabajo."
        },
        {
            name: "🏅 **Sistema de puntaje y evaluación**",
            value: "Tu desempeño será evaluado mediante un sistema de puntaje. Cada acción que realices será revisada por el equipo de **Sr.Mod**. Si una acción es rechazada, afectará tu puntaje. ¡Esfuérzate por mantenerlo alto y demuestra tu compromiso!"
        },
        {
            name: "💡 **Consejos para empezar**",
            value: "- Familiarízate con las reglas del servidor.\n- Revisa los canales de recursos y guías para staff.\n- No dudes en preguntar si tienes dudas.\n- Mantén una comunicación clara y profesional."
        },
        {
            name: "🚀 **Oportunidades de crecimiento**",
            value: "Como parte del equipo de staff, tendrás la oportunidad de:\n- Desarrollar habilidades de liderazgo y gestión.\n- Ganar experiencia en moderación y administración.\n- Ascender en el equipo según tu desempeño."
        },
        {
            name: "💬 **Comunicación y soporte**",
            value: "Si necesitas ayuda o tienes alguna duda, puedes mencionar a un **Sr.Mod** en este canal. También puedes revisar los canales de soporte para staff en el servidor."
        }
    )
    .setColor(0x00AE86) // Color verde, puedes cambiarlo según el tema del servidor
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .setFooter({
        text: "Equipo de administración",
        iconURL: client.user.displayAvatarURL()
    })
    .setTimestamp();
          await channel.send({
    embeds: [welcomeEmbed],
    content: `👋 **¡Hola ${user}!**\n\n¡Bienvenido oficialmente al equipo de staff! 🎉\nEste canal ha sido creado exclusivamente para ti. Aquí encontrarás todo lo necesario para desempeñar tu rol de manera efectiva. Por favor, revisa la información anterior y si tienes alguna duda, no dudes en preguntar. ¡Estamos aquí para apoyarte en cada paso!\n\n¡Gracias por ser parte de nuestro equipo y por contribuir a hacer de este servidor un lugar mejor! 💪`
}) .setTimestamp();
            
  
            
            
    
            await int.reply({
                content: `✅ Creado con exito <#${channel.id}>.`,
                ephemeral: true,
              });
    };
}

module.exports = regstaff;

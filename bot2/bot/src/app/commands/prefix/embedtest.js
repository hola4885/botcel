const Client = require("@client");
const { PrefixCommands } = require("@models");
const { Message,EmbedBuilder } = require("discord.js");

/**
 * Clase para representar el comando de ayuda (help).
 * @extends PrefixCommands
 */
class Help extends PrefixCommands {
    constructor() {
        super({
            name: "embeds",
       });
    }

    /**
     * Ejecuta la lógica asociada al comando 'help'.
     * @param {Client} client - El cliente Discord.js.
     * @param {Message<boolean>} message - El mensaje que activó el comando.
     * @param {string[]} args - Los argumentos del comando.
     */
    async run(client, message, args) {
        const embed = new EmbedBuilder()
        .setColor(0x1ABC9C)
        .setTitle("┌────────── ∘°❉°∘ ───────────┐\n📜  BIENVENIDO SR. MOD  📜\n└────────── °∘❉∘° ───────────┘")
        .setDescription(`¡Bienvenido al equipo de moderación!
  
  Como **Pilar del Equipo de Moderación**, tu rol es fundamental para guiar, capacitar y supervisar a nuestros moderadores y soportes.
  
  **Responsabilidades Principales:**
  - **Liderazgo:** Coordinar y motivar a los equipos.
  - **Capacitación:** Entrenar y actualizar a los moderadores.
  - **Coordinación de Eventos:** Organizar actividades y gestionar incidencias.
  - **Comunicación:** Mantener un canal fluido y transparente con todos los miembros.
  
  **Canales Importantes:**
  - **#recursos:** Consulta la documentación, herramientas y guías disponibles.
  - **#revisiones:** Revisa feedback, evaluaciones y actualizaciones periódicas.
  
  ¡Tu liderazgo marcará la diferencia y fortalecerá nuestra comunidad!`)
        .setFooter({ text: '¡Adelante, Sr. Mod! Estamos contigo en cada paso.' });
      
      message.channel.send({ embeds: [embed] });

    }
}

module.exports = Help;

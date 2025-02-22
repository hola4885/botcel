const Client = require("@client");
const { Buttons } = require("@models");
const { ButtonInteraction, CacheType } = require("discord.js");
const { AnySelectMenuInteraction, Events, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

/**
 * Clase para representar un ejemplo de botón interactivo.
 * @extends Buttons
 */
class Example extends Buttons {
    constructor(){
        super("Veri_CS");
    };

    /**
     * Ejecuta la lógica asociada al botón interactivo.
     * @param {Client} client - El cliente Discord.js.
     * @param {ButtonInteraction<CacheType>} int - La interacción del botón.
     */
    run(client, int) {
        const modal = new ModalBuilder()
        .setCustomId('cnv')
        .setTitle(`Verficacion`);

    // Componentes del modal
    const asuntoInput = new TextInputBuilder()
        .setCustomId('nombre')
        .setLabel('Nombre')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Escribe tu usuario')
        .setRequired(true);
  // Componentes del modal
  const descripcionInput = new TextInputBuilder()
  .setCustomId('cargo')
  .setLabel('Cargo')
  .setStyle(TextInputStyle.Short)
  .setPlaceholder('Escribe tu rol')
  .setRequired(true);

    
    modal.addComponents(
        new ActionRowBuilder().addComponents(asuntoInput),
        new ActionRowBuilder().addComponents(descripcionInput),
  
    );

    // Mostrar el modal al usuario
    int.showModal(modal).catch((err) => {
        console.error('Error mostrando el modal:', err);
        int.reply({
            content: 'Ocurrió un error al intentar mostrar el formulario. Por favor, inténtalo de nuevo más tarde.',
            ephemeral: true,
        });
    });

    };
}

module.exports = Example;

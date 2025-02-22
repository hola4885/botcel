const Client = require("@client");
const { Buttons } = require("@models");
const { ButtonInteraction, ModalBuilder,CacheType,ActionRowBuilder,TextInputBuilder,TextInputStyle } = require("discord.js");

/**
 * Clase para representar un ejemplo de botón interactivo.
 * @extends Buttons
 */
class Example extends Buttons {
    constructor(){
        super("Crear_Staff");
    };

    /**
     * Ejecuta la lógica asociada al botón interactivo.
     * @param {Client} client - El cliente Discord.js.
     * @param {ButtonInteraction<CacheType>} int - La interacción del botón.
     */
    run(client, int) {
  // Construir el modal
        const modal = new ModalBuilder()
            .setCustomId('staffn')
            .setTitle(`Agregar un staff`);

        // Componentes del modal
        const asuntoInput = new TextInputBuilder()
            .setCustomId('ID')
            .setLabel('ID')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('ID del staff')
            .setRequired(true);

        const descripcionInput = new TextInputBuilder()
            .setCustomId('nombre')
            .setLabel('Nombre')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Hola4885.')
            .setRequired(true);

        const prioridadInput = new TextInputBuilder()
            .setCustomId('carg')
            .setLabel('Cargo')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('T.staff,Soporte')
            .setRequired(true);


        // Añadir los componentes al modal
        modal.addComponents(
            new ActionRowBuilder().addComponents(asuntoInput),
            new ActionRowBuilder().addComponents(descripcionInput),
            new ActionRowBuilder().addComponents(prioridadInput),
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

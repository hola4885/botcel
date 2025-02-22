const Client = require("@client");
const { SelectMenu } = require("@models");
const { AnySelectMenuInteraction, Events, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

/**
 * Clase para representar un menú seleccionable mejorado.
 * @extends SelectMenu
 */
class tk extends SelectMenu {
    constructor() {
        super("tk");
    }

    /**
     * Ejecuta la lógica asociada al menú seleccionable.
     * @param {Client} client - El cliente Discord.js.
     * @param {AnySelectMenuInteraction} int - La interacción del menú seleccionable.
     */
    run(client, int) {
        const optionsMap = {
            tkBugError: 'Reportar un Bug/Error',
            tkSoporteGeneral: 'Soporte General',
            tkCompras: 'Problemas relacionados con Compras',
            tkReporte: 'Reportar comportamientos inapropiados',
            tkPostularStreamer: 'Postular para el rol de Streamer',
            tkPostularYouTuber: 'Postular para el rol de YouTuber',
            tkPostularOtroUsuario: 'Postular a otro usuario para un rol',
            tkFeedback: 'Enviar feedback sobre el servidor',
            tkSugerencia: 'Proponer una sugerencia',
        };

        // Validar si hay una selección válida
        const selectedOption = int.values[0];
        const ticketType = optionsMap[selectedOption] || 'Opción no reconocida';

        if (!optionsMap[selectedOption]) {
            return int.reply({
                content: 'La opción seleccionada no es válida. Por favor, intenta nuevamente.',
                ephemeral: true,
            });
        }

        console.log(`El usuario seleccionó: ${ticketType}`);

        // Construir el modal
        const modal = new ModalBuilder()
            .setCustomId('ticketModal')
            .setTitle(`Crear un ticket: ${ticketType}`);

        // Componentes del modal
        const asuntoInput = new TextInputBuilder()
            .setCustomId('asuntoInput')
            .setLabel('Asunto del ticket')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Escribe un breve título para el ticket')
            .setRequired(true);

        const descripcionInput = new TextInputBuilder()
            .setCustomId('descripcionInput')
            .setLabel('Descripción detallada')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Proporcione todos los detalles necesarios para ayudarnos a resolver su problema.')
            .setRequired(true);

        const prioridadInput = new TextInputBuilder()
            .setCustomId('prioridadInput')
            .setLabel('Prioridad del ticket')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Indica la prioridad (alta/media/baja)')
            .setRequired(true);

        const usuarioInput = new TextInputBuilder()
            .setCustomId('usuarioInput')
            .setLabel('Usuario involucrado')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Indica tu nombre de usuario o el del usuario involucrado')
            .setRequired(false);

        // Añadir los componentes al modal
        modal.addComponents(
            new ActionRowBuilder().addComponents(asuntoInput),
            new ActionRowBuilder().addComponents(descripcionInput),
            new ActionRowBuilder().addComponents(prioridadInput),
            new ActionRowBuilder().addComponents(usuarioInput)
        );

        // Mostrar el modal al usuario
        int.showModal(modal).catch((err) => {
            console.error('Error mostrando el modal:', err);
            int.reply({
                content: 'Ocurrió un error al intentar mostrar el formulario. Por favor, inténtalo de nuevo más tarde.',
                ephemeral: true,
            });
        });
    }
}

module.exports = tk;
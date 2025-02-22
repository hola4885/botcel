const { Client: Cli, Collection } = require("discord.js");
const { centrar, keys } = require("../../assets/config");
const { Buttons, ModalSubmit, PrefixCommands, SelectMenu, SlashCommands, SubCommands } = require("@models");
const Load = require("./load");



/**
 * @typedef { import("discord.js") .ClientOptions} ClientOptions
 */

class Client extends Cli {
    /**
     * Comandos disponibles en el cliente.
     * @property prefix - Colección de comandos de prefijo.
     * @property slash - Colección de comandos slash.
     * @property subSlahs - Colección de subcomandos slash.
     */
    commands = {
        /**
         * @type Collection<string, PrefixCommands>
         */
        prefix: new Collection(),
        /**
         * @type Collection<string, SlashCommands>
         */
        slash: new Collection(),
        /**
         * @type Collection<string, SubCommands>
         */
        subSlahs: new Collection()
    };
    /**
     * Interacciones disponibles en el cliente.
     * @property buttons - Colección de botones.
     * @property selectMenu - Colección de menús seleccionables.
     * @property modals - Colección de modales de presentación.
     */
    interaction = {
        /**
         * @type Collection<string, Buttons>
         */
        buttons: new Collection(),
        /**
         * @type Collection<string, SelectMenu>
         */
        selectMenu: new Collection(),
        /**
         * @type Collection<string, ModalSubmit>
         */
        modals: new Collection()
    };
    static center = centrar;
    /**
     * @param {ClientOptions} options
     */
    constructor(options) {
        super(options);
        this.keys = keys;
        this.center = centrar;
        this.load = new Load(this);

        this.interaction = {
            buttons: new Collection(),
            selectMenu: new Collection(),
            modals: new Collection()
        };
    }

    async login() {
        const token = this.keys.token;
        if (typeof token !== "string" || token.length === 0) {
            centrar("╭───────────────╮".blue);
            centrar("│".blue + "   Sin Token   ".red + "│".blue);
            centrar("╰───────────────╯".blue);
            return "";
        }
        try {
            centrar("╭──────────────────╮".blue);
            centrar("│".blue + "   Token Valido   ".yellow + "│".blue);
            centrar("╰──────────────────╯".blue);
            this.load.load_all();
            return await super.login(token);
        } catch {

            centrar("╭─────────────────╮".blue);
            centrar("│".blue + "    Token invalido   ".red + "│".blue);
            centrar("╰─────────────────╯".blue);
        }
        return "";
    }
}

module.exports = Client;

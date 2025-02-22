const { lstat, readdirSync } = require("fs");
const { join } = require("path");
const Client = require('@client');
const s = require("@models");
const promisify = require('util').promisify;
const { SelectMenu, SlashCommands, Buttons, SubCommands, ModalSubmit, Events, PrefixCommands } = s;

const import_fresh = require('import-fresh');
const erela_events = [
    "nodeCreate",
    "nodeDestroy",
    "nodeConnect",
    "nodeReconnect",
    "nodeDisconnect",
    "nodeError",
    "nodeRaw",
    "playerCreate",
    "playerDestroy",
    "queueEnd",
    "playerMove",
    "playerDisconnect",
    "trackStart",
    "trackEnd",
    "trackStuck",
    "trackError",
    "socketClosed"
];


const lstatAsync = promisify(lstat);

/**
 * Clase base para cargar comandos, interacciones y eventos en el cliente.
 */
class BaseLoad {
    /**
     * @param {Client} client - El cliente Discord.js.
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Carga archivos desde un directorio y configura comandos, interacciones y eventos.
     * @param {string} dir - La ruta del directorio a cargar.
     */
    async load(dir) {
        const files = await this.getFiles(dir);
        if (/\..\w+/.test(dir)) dir = __dirname + dir;
        files.forEach((value)=> {
            if(!value) return;
            const file = join(dir, value);
            try {
                const arch = import_fresh(file);
                let archivo;
                    try {
                        archivo = new arch();
                    } catch {
                       return undefined;
                    };
                // commands
                if (archivo instanceof PrefixCommands) {
                    archivo.filePath = file;
                    this.client.commands.prefix.set(archivo?.name, archivo);
                } else if (archivo instanceof SlashCommands) {
                    archivo.filePath = file;
                    this.client.commands.slash.set(archivo?.name, archivo);
                } else //interactions
                    if (archivo instanceof Buttons) {
                        archivo.filePath = file;
                        this.client.interaction.buttons.set(archivo?.customID, archivo);
                    } else if (archivo instanceof SelectMenu) {
                        archivo.filePath = file;
                        this.client.interaction.selectMenu.set(archivo?.customID, archivo);
                    } else if (archivo instanceof SubCommands) {
                        archivo.filePath = file;
                        this.client.commands.subSlahs.set(archivo?.name, archivo);
                    } else if (archivo instanceof ModalSubmit) {
                        archivo.filePath = file;
                        this.client.interaction.modals.set(archivo?.customID, archivo);
                    } else
                        // events
                        if (archivo instanceof Events) {

                            archivo.filePath = file;
                            if(erela_events.includes(archivo.name)) this.client.erelaManager.on(archivo.name, async (...args) => {
                                if (archivo instanceof Events) try {
                                    await archivo?.run(this.client, ...args)
                                } catch (e) {
                                    console.log(`Event-Error(${archivo.name}): ${e.message}`)
                                }});
                            else this.client.on(archivo.name, async (...args) => {
                                if (archivo instanceof Events) try {
                                    await archivo?.run(this.client, ...args)
                                } catch (e) {
                                    if ("presenceUpdate" == archivo.name) return;
                                    console.log(`Event-Error(${archivo.name}): ${e.message}`)
                                };
                            });
                        };
            } catch (e) {
                console.log(e)
            };
        })
 


        
    };

    /**
     * Obtiene la lista de archivos en un directorio.
     * @param {string} dir - La ruta del directorio.
     * @returns {Promise<string[]>} Una lista de nombres de archivos en el directorio.
     */
    async getFiles(dir) {
        /**
         * @type { string[] }
         */
        let files_array = [];
        if (dir.includes('../')) dir = __dirname + dir;

        const dir_folder = join(dir);
        const files = readdirSync(dir_folder);
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                const stats = await lstatAsync(join(dir_folder, file));
                if (stats.isDirectory()) {
                    this.load(join(dir_folder, file));
                } else if (stats.isFile() && file.endsWith('.d.ts')) return;
                else if (stats.isFile() && (file.endsWith('.js') || file.endsWith('.ts'))) {
                    files_array.push(file);
                }
            } catch (err) {
                console.error(err);
            }
        }
        return files_array;
    }
}

module.exports = BaseLoad;

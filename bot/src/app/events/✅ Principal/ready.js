const { Events } = require("@models");
const Client = require("@client");
const { ActivityType } = require('discord.js');

/**
 * Clase para representar el evento 'ready'.
 * @extends Events
 */
class Ready extends Events {
    constructor() {
        super('ready')
    };

    /**
     * Ejecuta la lógica asociada al evento 'ready'.
     * @param {Client} client - El cliente Discord.js.
     */
    async run(client) {
        

        client.center("╭────────────────╮".blue);
        client.center("│".blue + "  Bot Prendido  ".green + "│".blue);
        client.center("╰────────────────╯".blue);

        setTimeout(async () => {
            try {
                client.center("╭───────────────────────────╮".blue);
                client.center("│".blue + "  Cargando Comandos Slash  ".green + "│".blue);
                client.center("╰───────────────────────────╯".blue);

                await client.application.commands.set(client.commands.slash.map(x => x.toJson));
            } catch (error) {
                client.center("#".blue + ' Error Comandos '.red + '#'.blue);
                console.log(error.stack.slice(0, 500));
            };

        }, 10000)
        const activities = [
            { name: `en ${client.guilds.cache.size} Servers`, type: ActivityType.Listening },
            { name: `${client.channels.cache.size} canales`, type: ActivityType.Playing },
            { name: `${client.users.cache.size} Users`, type: ActivityType.Watching },
            { name: `Atendiendo tikets`, type: ActivityType.Competing },
            { name: "K.F.S is cool!", type: ActivityType.Playing}
        ];
        const status = [
            'online',
            'dnd',
            'idle'
        ];
        let i = 0;
        setInterval(() => {
            if(i >= activities.length) i = 0
            client.user.setActivity(activities[i])
            i++;
        },20000);
    
        let s = 0;
        setInterval(() => {
            if(s >= activities.length) s = 0
            client.user.setStatus(status[s])
            s++;
        }, 30000);
       

    };
    
}

module.exports = Ready;

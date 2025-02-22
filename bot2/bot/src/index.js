const fs = require("fs");
const path = require("path");
const { GatewayIntentBits, Partials } = require("discord.js");
require("./paths");
require("../mongodb/conexion/connect");

process.stdout.write("\x1Bc");
const Client = require("@client");
Client.center("╭──────────────────────────╮".blue);
Client.center("│".blue + "   Prendiendo Aplicacion  ".green + "│".blue);
Client.center("╰──────────────────────────╯".blue);

const client = new Client({
  intents: [
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction,
  ],
});

// Manejo de errores no controlados
process.on("unhandledRejection", async (err) => {
  console.log(`[ANTI - CRASH] Unhandled Rejection : ${err}`.red.bold);
});

// Ruta de la carpeta de eventos
const eventsPath = path.join(__dirname, "app/events");

// Verificar si el directorio de eventos existe
if (!fs.existsSync(eventsPath)) {
  console.error("Directorio de eventos no encontrado:", eventsPath);
  process.exit(1); // Terminar ejecución si no encuentra la carpeta
}

// Cargar eventos automáticamente
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// Iniciar sesión con el token
client.login();
module.exports = client;
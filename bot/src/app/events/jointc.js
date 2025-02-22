const Client = require("@client");
const { Events } = require("@models");
const { ChannelType, Collection } = require("discord.js");
let voiceManager = new Collection();
const schema = require('../../../../mongodb/models/join-to-create')
/**
 * Clase de ejemplo que representa un evento personalizado.
 * @extends Events
 */
class Example extends Events {
    /**
     * Crea una instancia de Example.
     */
    constructor(){
        super('voiceStateUpdate')
    };

    /**
     * Método que se ejecuta cuando se dispara el evento.
     * @param {Client} client - El cliente Discord.js.
     * @param {...any} args - Argumentos adicionales para el evento.
     */
   async run(client, ...args) {
    let newState = args[1];
        let oldState = args[0];

        // Verifica que `oldState` y `newState` no sean undefined
        if (!oldState || !newState) return;

        const { member, guild } = oldState;
        const newChannel = newState.channel;
        const oldChannel = oldState.channel;

        const data = await schema.findOne({ Guild: guild.id })
        if (!data) return;
    
        if (data) {
            const channelid = data.Channel
            const channel = client.channels.cache.get(channelid);
            const userlimit = data.UserLimit
    
            if (oldChannel !== newChannel && newChannel && newChannel.id === channel.id) {
                const voiceChannel = await guild.channels.create({
                    name: `${member.user.tag}`,
                    type: ChannelType.GuildVoice,
                    parent: newChannel.parent,
                    permissionOverwrites: [
                        {
                            id: member.id,
                            allow: ["Connect", "ManageChannels"],
                        },
                        {
                            id: guild.id,
                            allow: ["Connect"],
                        },
                    ],
                    userLimit: userlimit
                }
                );
    
                voiceManager.set(member.id, voiceChannel.id);
    
                await newChannel.permissionOverwrites.edit(member, {
                    Connect: false
                });
                setTimeout(() => {
                    newChannel.permissionOverwrites.delete(member);
                }, 30000);
    
                return setTimeout(() => {
                    member.voice.setChannel(voiceChannel);
                }, 500);
            }
    
            const jointocreate = voiceManager.get(member.id);
            const members = oldChannel?.members
                .filter((m) => !m.user.bot)
                .map((m) => m.id);
            if (
                jointocreate &&
                oldChannel.id === jointocreate &&
                (!newChannel || newChannel.id !== jointocreate)
            ) {
                if (members.length > 0) {
    
                    let randomID = members[Math.floor(Math.random() * members.length)];
                    let randomMember = guild.members.cache.get(randomID);
                    randomMember.voice.setChannel(oldChannel).then((v) => {
                        oldChannel.setName(randomMember.user.username).catch((e) => null);
                        oldChannel.permissionOverwrites.edit(randomMember, {
                            Connect: true,
                            ManageChannels: true
                        });
                    });
                    voiceManager.set(member.id, null);
                    voiceManager.set(randomMember.id, oldChannel.id);
                } else {
                    voiceManager.set(member.id, null);
                    oldChannel.delete().catch((e) => null);
                }
            }
        }
    }}

module.exports = Example;
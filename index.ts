import { Client, GatewayIntentBits, Partials } from 'discord.js';
import eventHandlers from './events/index';
const dotenv = await import('dotenv');
dotenv.config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages],
    partials: [Partials.Message]
});

for (const [event, handler] of Object.entries(eventHandlers)) {
    if (handler) {
        client.on(event, handler);
    }
}

client.login(process.env.DISCORD_TOKEN);
export {client};
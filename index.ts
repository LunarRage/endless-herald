import { Client, GatewayIntentBits, Partials } from 'discord.js';
import eventHandlers from './events/index';
import endlessLogger from './lib/logger';


const client = new Client({
    intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages],
    partials: [Partials.Message]
});



async function setup(){

    try {
        const dotenv = await import('dotenv');
        dotenv.config();
        
        for (const [event, handler] of Object.entries(eventHandlers)) {
            if (handler) {
                client.on(event, handler);
            } 
        }   
        
        client.login(process.env.DISCORD_TOKEN);
        endlessLogger.info('Bot is logging in');
    } catch (error) {
        endlessLogger.error(error, 'Error in setup');
        process.exit(1);
    }
    
}

setup();


export {client};
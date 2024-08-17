import { Client, GatewayIntentBits, Partials } from 'discord.js';
import eventHandlers from './events/index';
import endlessLogger from './lib/logger';


/**
 * Main client instance of the Discord bot.
 * The client is responsible for handling interactions with the Discord API.
 *
 * @type {Client}
 * @memberof DiscordBot
 */
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    partials: [Partials.Message]
});

/**
 * Asynchronously sets up the bot by loading environment variables,
 * registering event handlers, and logging into Discord.
 * 
 * @async
 * @function setup
 * @memberof DiscordBot
 * @returns {Promise<void>} - A promise that resolves when the bot is successfully set up.
 * @throws Will throw an error if there's an issue in the setup process.
 */
async function setup(): Promise<void> {

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

/**
 * Initiates the setup process for the Discord bot.
 * 
 * @memberof DiscordBot
 */
setup();

/**
 * Exporting the client for external usage, such as for testing or additional event handling.
 * 
 * @type {Client}
 * @memberof DiscordBot
 */
export { client };
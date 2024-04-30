import { EmbedBuilder, TextChannel } from "discord.js";
import { client } from "../index";
import endlessLogger from "../lib/logger";
require('dotenv').config();

const MAIN_CHANNEL = `🎫｜delegation-listings`;
const TESTING_CHANNEL = `test-delegation-listings`;

export async function broadcastToAllGuilds(embeds:EmbedBuilder[]){
    let guilds = client.guilds.cache;
    let channels:TextChannel[] = [];
    let listing_channel = process.env.node_env === 'production' ? MAIN_CHANNEL : TESTING_CHANNEL;

    guilds.forEach(guild=>{
        let foundChannel = guild.channels.cache.find(channel => channel.name === listing_channel);

        if(foundChannel){
            channels.push(foundChannel as TextChannel);
        }
    });

    if(channels.length === 0){
        endlessLogger.error('No channels found');
        return;

    }

    channels.map(channel=>{
        endlessLogger.info(`Channel found: ${channel.name}`);
    });
    
    await broadcastEmbedsInSetsCron(channels,embeds);

}

function chunkEmbeds(embeds:EmbedBuilder[], size:number) {
    const chunked= [];
    for (let i = 0; i < embeds.length; i += size) {
        chunked.push(embeds.slice(i, i + size));
    }
    return chunked;
}

async function broadcastEmbedsInSetsCron(channels:TextChannel[], embeds:EmbedBuilder[]) {
    const embedSets = chunkEmbeds(embeds, 5); // Assuming chunkEmbeds is defined elsewhere
    embedSets.forEach((embedSet, index) => {
        // Calculate delay for each set
        const delayMilliseconds = index * 10000; // 10 seconds per set

        setTimeout(async () => {
            await sendEmbedSetToChannels(channels, embedSet, index);
            // Use your logger here instead of console.log as needed
        }, delayMilliseconds);
    });
}

async function sendEmbedSetToChannels(channels:TextChannel[], embedSet:EmbedBuilder[],setIndex:number) {
    for (const channel of channels) {
        try {
            await channel.send({ embeds: embedSet });
        } catch (error) {
            endlessLogger.error( error,`Error sending embeds to channels`);
        }
    }
}
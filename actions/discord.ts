import { EmbedBuilder, TextChannel } from "discord.js";
const dotenv = await import('dotenv');
dotenv.config();

const ClientID = process.env.CLIENT_ID;


const landEmbedBuilder = new EmbedBuilder()



export async function sendLandEmbedMessageToChannel(channel: TextChannel, newLandListings:[]){

}
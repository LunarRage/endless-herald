import { Client, EmbedBuilder} from 'discord.js';
import endlessLogger from '../lib/logger';
import { Land, LandData, LastBroadcasted, RoninUser, landQuery } from '../types/apiTypes';
import { getLandDelegationOrders } from '../API/landDelegation';
import { getRNSInstance } from '../lib/rns';
import { addListing } from '../lib/redisClient';
import cron from 'node-cron';
import { buildListingEmbed } from '../utils';
import prevBroadcast from '../lib/prevBroadcasted.json';
import { updateLastBroadcasted } from '../lib/fileSync';
import { broadcastToAllGuilds } from '../actions/discord';


const handleClientReady = async (client: Client) => {
    endlessLogger.info(`Bot is ready! Logged in as ${client.user?.tag}`);
    cron.schedule('* * * * *', processBroadcastings);
};

async function processBroadcastings(){

    endlessLogger.info(`Running Broadcast Process...`);
    let baseURL = `https://land-delegate-api.axieinfinity.com/land/v1/public/contract/marketplace`;
    let query: landQuery = {
        page: 1,
        limit: 20,
        order: 'created_at',
        sort: 'desc'
    }
    let result = await getLandDelegationOrders(baseURL, query);
    
    if(!result.data){
       return; 
    }

    let listingsToBroadcast = await updateRedisCache(result.data);
    let embedListings = await formatEmbedListings(listingsToBroadcast);

    if(embedListings.length > 0){
        await broadcastToAllGuilds(embedListings);
    }
}

async function updateRedisCache(listings:LandData[]):Promise<LandData[]>{
    
    const lastBroadcasted: LastBroadcasted = prevBroadcast;

    // Add the listings to the cache
    let potentialNewListings = (await Promise.all(listings.map(async (listing)=>{
         let isNew = await addListing(listing.id, listing);
         if(isNew){
                return listing;
         }
         return null;
    }))).filter(listing=>listing) as LandData[];

    let newListings = potentialNewListings.filter(listing=>{
        return !lastBroadcasted.broadcasted.some(broadcasted=>{
            return broadcasted.id == listing.id;
        });
    });


    let newBroadCastedListings = newListings.map(listing=>{
        return {id: listing.id, created_at: new Date()};
    });

    lastBroadcasted.broadcasted = [...lastBroadcasted.broadcasted, ...newBroadCastedListings]; 
    
    if(newListings.length > 0){
        await updateLastBroadcasted(lastBroadcasted);
        endlessLogger.info(`Broadcasted ${newListings.length} new listings`);
    }
    
    return newListings;
}

async function formatEmbedListings(listings:LandData[]):Promise<EmbedBuilder[]>{
    const rnsMap = new Map<string, RoninUser>();
    let result:EmbedBuilder[] = [];

    if(!listings || listings.length == 0){
        return result;
    }
    
    let ownerAddresses = listings.map((listing)=>{return listing.owner});
    let rns = await getRNSInstance();
    
    await Promise.all(ownerAddresses.map( async ownerAddr =>{
        let rnsValue = await rns.getName(ownerAddr);
        if(rnsValue && rnsValue.name){
            rnsMap.set(ownerAddr, {
                rnsName: rnsValue.name,
                roninAddress: ownerAddr
            });
        }
    }));

    let embeds = listings.map(listing =>{
        let potentialRNS = rnsMap.get(listing.owner);
        if(potentialRNS){
            return buildListingEmbed(listing, potentialRNS);
        }else{
            return buildListingEmbed(listing);
        }
    });

    result = embeds;
    return result;
}


export default handleClientReady;
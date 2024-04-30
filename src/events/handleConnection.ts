import { Client, EmbedBuilder} from 'discord.js';
import endlessLogger from '../lib/logger';
import { Land, LandData, RoninUser, landQuery } from '../types/apiTypes';
import { getLandDelegationOrders } from '../API/landDelegation';
import { getRNSInstance } from '../lib/rns';
import { addListing, isExistingListing } from '../lib/redisClient';
import cron from 'node-cron';
import { buildListingEmbed } from '../utils';
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

    try {
        let newListings = (await Promise.all(listings.map(async (listing)=>{
            let isNewListing = await isExistingListing(listing.id);
            
            if(!isNewListing){
                await addListing(listing.id, listing);
                return listing;
            }
            
            return null;
        }))).filter(listing=>listing) as LandData[];

        if(newListings.length > 0){
            endlessLogger.info(`Broadcasted ${newListings.length} new listings`);
        }

        return newListings;


    } catch (error) {
        endlessLogger.error(error, `Error updating Redis cache`);
        return [];
    }
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
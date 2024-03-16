import { Client} from 'discord.js';
import endlessLogger from '../lib/logger';
import { landQuery } from '../types/apiTypes';
import { getLandDelegationOrders } from '../API/landDelegation';
import { RNSInstance } from '../lib/rns';


const handleClientReady = async (client: Client) => {
    endlessLogger.info(`Bot is ready! Logged in as ${client.user?.tag}`);
    let baseURL = `https://land-delegate-api.axieinfinity.com/land/v1/public/contract/marketplace`;
    let query: landQuery = {
        page: 1,
        limit: 20,
        order: 'created_at',
        sort: 'desc'
    }
    let result = await getLandDelegationOrders(baseURL, query);
    let wordResult = await RNSInstance.getAddr('victoria.ron');
    endlessLogger.info(wordResult);
};

export default handleClientReady;
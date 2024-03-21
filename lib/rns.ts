import { JsonRpcProvider } from "@ethersproject/providers";
import { RNS } from '@roninnetwork/rnsjs';
require('dotenv').config();



async function setup():Promise<RNS>{
    const CHAINID = 2020;
    const provideURL = `https://api-gateway.skymavis.com/rpc?apikey=${process.env.SM_API_KEY}`
    const provider = new JsonRpcProvider(provideURL);
    
    const RNSInstance = new RNS();
    await RNSInstance.setProvider(provider,CHAINID);
    return RNSInstance;
}

//Export a wrapper function instead of the instance directly
export async function getRNSInstance(): Promise<RNS> {
    return setup();
}


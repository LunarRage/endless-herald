import { JsonRpcProvider } from "@ethersproject/providers";
import { RNS } from '@roninnetwork/rnsjs';
const dotenv = await import('dotenv');
dotenv.config();

const CHAINID = 2020;
const provideURL = `https://api-gateway.skymavis.com/rpc?apikey=${process.env.SM_API_KEY}`
const provider = new JsonRpcProvider(provideURL);


const RNSInstance = new RNS();
await RNSInstance.setProvider(provider,CHAINID);

export { RNSInstance };


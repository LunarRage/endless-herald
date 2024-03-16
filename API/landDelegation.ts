import endlessLogger from "../lib/logger";
import { ApiResponse, LandData, landQuery } from "../types/index";

const baseURL = `https://land-delegate-api.axieinfinity.com/land/v1/public/contract/marketplace`;


//?page=1&limit=20&order=created_at&sort=desc

export async function getLandDelegationOrders(baseURL:string, query:landQuery):Promise<ApiResponse<LandData>>{

    const queryString = Object.entries(query).reduce((acc, [key, value]) => {
        acc.set(key, value.toString());
        return acc;
      }, new URLSearchParams());
    
    const url = `${baseURL}?${queryString.toString()}`;

    try {
        const response = await fetch(url);
        if(!response.ok){
            return {
                data:null,
                error:{
                    message:`Unable to fetch land data: ${response.statusText}`,
                    code:response.status
                }
            }
        }

        const data:LandData = await response.json();

        return { data, error:null }
    } catch (error) {
        endlessLogger.info(error,`Error fetching land data`);
        return {
            data:null,
            error:{
                message: error instanceof Error ?error.message: 'An unknown error occurred',
            }
        }
    }
}
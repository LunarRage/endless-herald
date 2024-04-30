import endlessLogger from "../lib/logger";
import { LandAPIResponse, landQuery} from "../types/index";

//?page=1&limit=20&order=created_at&sort=desc

export async function getLandDelegationOrders(baseURL:string, query:landQuery):Promise<LandAPIResponse>{

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
                total:0
            }
        }

        let jsonData = await response.json() as LandAPIResponse;

        return jsonData;
    } catch (error) {
        endlessLogger.info(error,`Error fetching land data`);
        return {
            data:null,
            total:0
        }
    }
}
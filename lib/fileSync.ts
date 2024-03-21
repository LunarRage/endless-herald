import { writeFile } from "fs/promises";
import { LastBroadcasted } from "../types";
import endlessLogger from "./logger";
import path from "path";

const FILEPATH = path.join(__dirname, 'prevBroadcasted.json');

export async function updateLastBroadcasted(prevBroadcast: LastBroadcasted): Promise<void> {
    try {

        
        prevBroadcast.broadcasted = prevBroadcast.broadcasted.map(listing=>{
            if(typeof listing.created_at == 'string'){
                listing.created_at = new Date(listing.created_at);
            }
            return listing;
        }).sort((a, b) => {
            return (b.created_at as Date).getTime() - (a.created_at as Date).getTime();
        });
        prevBroadcast.broadcasted = prevBroadcast.broadcasted.slice(0, 20);
        
        
        const jsonData = JSON.stringify(prevBroadcast, null, 2);
        await writeFile(FILEPATH, jsonData, 'utf8');
        endlessLogger.info('Last Broadcasted updated');

    } catch (error) {
        endlessLogger.error('Error updating Last Broadcasted', error);
    }
}
import { writeFile } from "fs/promises";
import { LastBroadcasted } from "../types";
import endlessLogger from "./logger";
import path from "path";

// Get the directory path of the current module
const currentModuleDirectory = path.dirname(__filename);

// Go up two levels to get to the correct directory
const parentDirectory = path.dirname(currentModuleDirectory);

 // Define the log directory within the current module's directory
 const logDirectory = path.join(parentDirectory,'/storage/prevBroadcasted.json');

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
        await writeFile(logDirectory, jsonData, 'utf8');
        endlessLogger.info('Last Broadcasted updated');

    } catch (error) {
        endlessLogger.error('Error updating Last Broadcasted', error);
    }
}
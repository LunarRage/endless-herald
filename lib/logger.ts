import { pino, Logger } from 'pino';
import fs from 'fs';
import path from 'path';



async function setup(): Promise<Logger>{
    try {
        let logger: Logger;
        const dotenv = await import('dotenv');
        dotenv.config();

        // Determine the environment
        const environment = process.env.NODE_ENV || 'production';

        // Get the directory path of the current module
        const currentModuleDirectory = path.dirname(new URL(import.meta.url).pathname);

        // Go up two levels to get to the correct directory
        const parentDirectory = path.dirname(currentModuleDirectory);

        // Define the log directory within the current module's directory
        const logDirectory = path.join(parentDirectory, process.env.LOG_FILE_PATH || '/app/logs');

        // Define the log file path
        const logFilePath = path.join(logDirectory, 'app.log');

        

        
        if (environment === 'development') {
            // Log to the console in development environment
            //Lets add pino-pretty for better logs

            logger = pino({
                        level: process.env.LOG_LEVEL || 'info',
                        transport: {
                            target: 'pino-pretty'
                        },
                        timestamp: pino.stdTimeFunctions.isoTime
                    });
        } else {
            // Log to a file in the production environment
            const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
            logger = pino({
                        level: process.env.LOG_LEVEL || 'info',
                        timestamp: pino.stdTimeFunctions.isoTime
                    }, logStream);
        }
        return logger;
        
    } catch (error) {
        console.error(error, 'Error creating log directory');
        process.exit(1);
    }
}

const endlessLogger = await setup();
export default endlessLogger;
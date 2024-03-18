import { pino, Logger } from 'pino';
import fs from 'fs';
import path from 'path';
require('dotenv').config();




function setup():Logger{
    try {
        let logger: Logger;

        // Determine the environment
        const environment = process.env.NODE_ENV || 'production';

        // Get the directory path of the current module
        console.log(__filename);
        const currentModuleDirectory = path.dirname(__filename);

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

const endlessLogger = setup();
export default endlessLogger;
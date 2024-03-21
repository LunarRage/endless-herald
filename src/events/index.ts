import { ClientEvents } from "discord.js";
import handleClientReady from "./handleConnection";


type EventHandler<K extends keyof ClientEvents> = (...args:ClientEvents[K]) => void;

const eventHandlers: Partial<Record<keyof ClientEvents, EventHandler<any> | null>> = {
    ready: handleClientReady
};

export default eventHandlers;
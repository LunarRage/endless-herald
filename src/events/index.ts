import { ClientEvents } from "discord.js";


type EventHandler<K extends keyof ClientEvents> = (...args:ClientEvents[K]) => void;

const eventHandlers: Partial<Record<keyof ClientEvents, EventHandler<any> | null>> = {
    ready: null,
    interactionCreate: null
};

export default eventHandlers;
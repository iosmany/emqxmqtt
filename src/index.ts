
import { EmqxHandler } from './core/wrapper';

export const handler: EmqxHandler = new EmqxHandler();

export function boot(){
    handler.init();
    console.log("bootstraped library");
}

export function sendMessage(topic:string, message:any){
    handler.send(topic, message);
}

import mqtt from "mqtt";
import { UpdateClientMap } from './interfaces';

const options = {
    clean: true, // retain session
    connectTimeout: 4000, // Timeout period
    // Authentication information
    clientId: 'emqx_' + new Date().getTime(),
    username: 'emqx',
    password: 'emqx',
};

const connectUrl = "ws://localhost:8083/mqtt";

export class EmqxHandler {

    constructor(){}

    readonly coordTopics = "coord_position";
    readonly clientsQueue = "clientes";
    readonly sellQueue = "ventas";
    readonly buyQueue = "compras";

    // esto no se debe hacer, es una mala práctica
    private client: any = {};

    init(){

        const self= this;
        this.client = mqtt.connect(connectUrl, options);
        
        //esto indica que cuando se conecte se debe suscribir a la cola/topics coord_position 
        this.client.on('connect', ()=>{
            //llegados aquí se ha realizado la conexión correctamente
            //toca suscribirse/apuntarse a la(s) cola(s) 
            //NOTA OJO: cuando te suscribes si la cola/topics no existe la crea automáticamente
            self.client.subscribe(self.coordTopics, (err: any) => {
                if(err){
                    console.log(err);
                }
            });
            //te apuntas a clientsQueue
            self.client.subscribe(self.clientsQueue, (err: any)=>{
                if(err){
                    console.log(err);
                }
            });
            //te apuntas a sellQueue
            self.client.subscribe(self.sellQueue, (err: any)=>{
                if(err){
                    console.log(err);
                }
            });
            //te apuntas a buyQueue
            self.client.subscribe(self.buyQueue, (err: any)=>{
                if(err){
                    console.log(err);
                }
            });
        });

        //escuchar eventos
        this.client.on('reconnect', (error: any) => {
            console.log('reconnecting:', error)
        });

        this.client.on('error', (error: any) => {
            console.log('Connection failed:', error)
        });

        //IMPORTANTE: este es tu punto de entrada de los mensajes
        this.client.on('message', (topic: string, message: any) => {

            if (topic === self.coordTopics){ 
                debugger;
                const objMessage: UpdateClientMap = JSON.parse(message.toString());
                
                if (objMessage.latitud === 0 || objMessage.longitud === 0){
                     console.log("datos incorrectos");
                     throw "las datos de posición son incorrectos";
                }
                //do some action here     
                console.log("procesando mensaje de " + self.coordTopics);
             }
             else if(topic === self.clientsQueue){
                console.log("procesando mensaje de " + self.clientsQueue);
             }
            //.. do rest
            console.log('message gotted：', topic, message.toString())
        });

        console.log("emqx inicializado");
    }

    send(topic:string, message: any){
        this.client.publish(topic, message);
    }
}





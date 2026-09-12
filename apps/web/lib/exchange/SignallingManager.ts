
const BASE_URL = "ws://localhost:3001";

/**
 * Because the SignallingManager should not itself decide what the UI does with every message. 
 * It should only receive the WebSocket message and then notify whoever is interested.
 * WebSocket receives depth
        ↓
SignallingManager
        ↓
"Who asked to be notified about depth?"
        ↓
run their callback functions
 */



export class SignallingManager{
    private ws: WebSocket;
    private initialized: boolean = false;
    private id: number = 1;
    private static instance: SignallingManager;
    private bufferedMessages: any[] = [];//Because the WS server if not connected at all the messages get stored in this array and once it is connected then it sends all the messages from the queue itself
    /**
     * callbacks = {
    depth: [
        {
            id: "DEPTH-TATA_INR",
            callback: function
        }
    ]
}
     */
    private callbacks: {[key:string]:  {
      callback: (data:string) => void;
      id: string;
    }[]
    } = {};//used for which component wants which data field
   //Pvt because the new SignallingManager() should not be called everywhere throughout.
   private constructor(){
     this.ws = new WebSocket(BASE_URL);
     this.init();
   }


    public static getInstance(){
     if(!this.instance){
        this.instance = new SignallingManager();
     }    
     return this.instance;
    }

    init(){
        this.ws.onopen = () => {
           this.initialized = true;
           console.log('Connection is open');
            this.bufferedMessages.forEach((message) => {
               this.ws.send(JSON.stringify(message));
            });
            this.bufferedMessages = [];
        }
        this.ws.onmessage = (event) => {
         const message = JSON.parse(event.data);
         console.log(message);
         const type = message.data.e;

         if(this.callbacks[type]){
            this.callbacks[type].forEach(({ callback }) => {
               callback(message.data);
            })
         }
        }
        this.ws.onclose = () => {
           this.initialized = false;
        }
    }
    sendMessage(message: any){
      if(!this.initialized){
         console.log("Websocket connection is not initialized yet");
         this.bufferedMessages.push(message);
         return;
      }
      this.ws.send(JSON.stringify(message));
    }

   registerCallback(
      type: string,
      callback: (data: any) => void,
      id: string
   ){
      this.callbacks[type] = this.callbacks[type] || [];

      this.callbacks[type].push({
         callback,
         id
      })
   }

   deregisterCallback(
      type: string,
      id: string
   ){
      if(!this.callbacks[type])return;

      this.callbacks[type] = this.callbacks[type].filter(
        (item) => item.id !== id
      );
   }
}
import {Injectable} from "@angular/core";
import * as signalR from "@aspnet/signalr";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class MessageService{
  private hubConnection: signalR.HubConnection | undefined;
  constructor(private http: HttpClient) {
    // this.connect();
  }
  connect(){
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:44301/messageHub")
      .build();
    this.hubConnection.start().catch((e)=>{
      console.log(e);
    });
    this.hubConnection.on("message", (message) => {
      console.log(message);
    });
  }
  sendMessageToServer(message: string) {
    if(this.hubConnection){
      this.hubConnection.invoke("sendMessageToClients", message).catch((error) => {
        console.error(error);
      });
    }
  }
}

// import { io, Socket } from "socket.io-client";
// import { MessageComposeD, MessageFrom, VisitorStatus } from "../types/socket";
// import { SocketEmiterE } from "../types/enum/socket";
// import { MessageActionBtnItemD, onMessagePayloadD } from "../types/message";
// import { setContactArgs, setSessionArgs, setVisitorArgs } from "../types/sdkManager";
// import { getSocketEndpoint } from "./config";

// const SE = getSocketEndpoint() + "/chatbot";

// const SOCKET_ENDPOINT = import.meta.env.DEV ? import.meta.env.VITE_SOCKET_ENDPOINT || SE : SE;

// class SocketManager {
//   socket!: Socket;
//   sessionData: any = null;

//   constructor() {
//     this.initializeSocket();
//   }

//   initializeSocket() {
//     this.socket = io(SOCKET_ENDPOINT, {
//       transports: ["websocket", "polling"],
//     });
//   }

//   reconnectSocket() {
//     if (!this.socket.connected) {
//       console.log("Attempting to reconnect...");
//       this.initializeSocket();
//     }
//   }

//   emitEvent(eventName: string, data: any) {
//     // Emit a socket event with optional data
//     this.socket.emit(eventName, data);
//   }

//   createSession(data: { widget_uid: string; visitor_uid: string; language: string }) {
//     const send_by: MessageFrom = "user";
//     const raw = { ...data, send_by, user_agent: navigator.userAgent };
//     this.socket.emit(SocketEmiterE.createSession, raw);
//   }
//   joinSession(data: {
//     chatbot_uid: string;
//     session_uid: string;
//     user: {
//       name: any;
//     };
//   }) {
//     // console.log("EMIT JOIN SESSION");
//     const raw = { ...data, device: { page_title: document.title, url: window.location.href } };
//     this.socket.emit(SocketEmiterE.joinSession, raw);
//   }

//   sendMessage(data: { session_uid: string; widget_uid: string; is_stream: boolean } & onMessagePayloadD) {
//     const send_by: MessageFrom = "user";
//     const raw = { ...data, flow_id: "", send_by };

//     // console.log("EMIT SEND MESSAGE");
//     this.socket.emit(SocketEmiterE.sendMessage, raw);
//   }
//   navigation(data: { visitor_uid: string; page_title: string; url: string; widget_uid: string }) {
//     // console.log("EMIT NAVIGATION");
//     this.socket.emit(SocketEmiterE.navigation, data);
//   }

//   sendCompose(data: MessageComposeD) {
//     // console.log("EMIT COMPOSE", data.content.type);
//     this.socket.emit(SocketEmiterE.compose, data);
//   }

//   getHistory(data: { chatbot_uid: string; session_uid: string; widget_uid: string }) {
//     this.socket.emit(SocketEmiterE.history, data);
//   }

//   //NEW
//   createVisitor(data: { widget_uid: string }) {
//     // console.log("EMIT CREATE VISITOR", data, this.socket.connected);
//     const raw = { ...data, user_agent: navigator.userAgent };
//     this.socket.emit(SocketEmiterE.createVisitor, raw);
//   }
//   joinVisitor(data: { widget_uid: string; visitor_uid: string }) {
//     // console.log("EMIT JOIN VISITOR");
//     this.socket.emit(SocketEmiterE.joinVisitor, data);
//   }

//   messageUpdateAction(data: { widget_uid: string; visitor_uid: string; session_uid: string; message_id: string; choices: MessageActionBtnItemD[] }) {
//     // console.log("UPDATE MESSAGE ACTION", data);
//     this.socket.emit(SocketEmiterE.messageActionUpdate, data);
//   }

//   messsagesMarkSeen(data: { session_uid: string; widget_uid: string; visitor_uid: string }) {
//     // console.log("EMIT MESSAGES SEEN");
//     const seen_by: MessageFrom = "user";
//     const raw = { ...data, seen_by };
//     this.socket?.emit(SocketEmiterE.messagesMarkSeen, raw);
//   }

//   setVisitorData(data: setVisitorArgs) {
//     // console.log("EMIT SET VISITOR DATA");
//     this.socket.emit(SocketEmiterE.setVisitorData, data);
//   }

//   setContactData(data: setContactArgs) {
//     // console.log("EMIT SET SESSION DATA");
//     this.socket.emit(SocketEmiterE.setContactData, data);
//   }

//   updateVisitorStatus(data: { widget_uid: string; visitor_uid: string; status: VisitorStatus }) {
//     // console.log("EMIT UPDATE VISITOR STATUS");
//     this.socket.emit(SocketEmiterE.updateVisitorStatus, data);
//   }

//   messagesDelivered(data: { widget_uid: string; visitor_uid: string }) {
//     this.socket.emit(SocketEmiterE.messagesDelivered, data);
//   }

//   setSessionData(data: setSessionArgs) {
//     // console.log("EMIT SET CONTACT DATA");
//     this.socket.emit(SocketEmiterE.setSessionData, data);
//   }
// }

// // Create a single instance of the SocketManager
// const socketManager = new SocketManager();

// export default socketManager;

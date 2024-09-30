import { useCallback, useEffect } from "react";
import { useChatbot } from "../context/ChatbotContext";
// import socketManager from "../utils/socket";
// import { SocketListenE } from "../types/enum/socket";

declare global {
  interface Window {
    // $yourGptChatbot: any; // Deprecated
    $yourgptChatbot: any;
  }
}

type Action = "set" | "execute" | "on" | "off";
type Method = "init" | "widget:open" | "widget:close" | "widget:popup" | "message:send";

interface Listener {
  [key: string]: any[];
}

const listeners: Listener = {};

const sessionSetQueue: any[] = [];
// const visitorSetQueue: any[] = [];
// const contactSetQueue: any[] = [];

export default function SdkManager() {
  const { sessionCreated, setChatbotPopup, chatbotPopup, setExecution, widgetUid, activeSession } = useChatbot();

  const handleSet = useCallback(
    (method: Method, arg: any) => {
      if (!method) return;

      //SESSION SET
      const sessionSet = method.split(":")[0] === "session";
      if (sessionSet) {
        const setKey = method.split(":")[1];
        switch (setKey) {
          case "data":
            if (arg && !Array.isArray(arg) && typeof arg == "object") {
              if (activeSession?.session_uid) {
                // socketManager.setSessionData({
                //   widget_uid: widgetUid,
                //   session_uid: activeSession?.session_uid,
                //   data: arg,
                // });
              } else {
                sessionSetQueue.push({
                  data: arg,
                });
              }
            }
            break;
          default:
            break;
        }
      }

      //VISITOR SET
      // const visitorSet = method.split(":")[0] === "visitor";
      // if (visitorSet) {
      //   const setKey = method.split(":")[1];
      //   switch (setKey) {
      //     case "data":
      //       if (arg && !Array.isArray(arg) && typeof arg == "object") {
      //         if (visitorUid) {
      //           socketManager.setVisitorData({
      //             widget_uid: widgetUid,
      //             visitor_uid: visitorUid,
      //             data: arg,
      //           });
      //         } else {
      //           visitorSetQueue.push({
      //             data: arg,
      //           });
      //         }
      //       }
      //       break;
      //     default:
      //       break;
      //   }
      // }

      //CONTACT SET
      // const contactSet = method.split(":")[0] === "contact";
      // if (contactSet && visitorUid) {
      //   const setKey = method.split(":")[1];
      //   switch (setKey) {
      //     case "data":
      //       if (arg && !Array.isArray(arg) && typeof arg == "object") {
      //         if (visitorUid) {
      //           socketManager.setContactData({
      //             widget_uid: widgetUid,
      //             visitor_uid: visitorUid,

      //             data: arg,
      //           });
      //         } else {
      //           contactSetQueue.push({
      //             data: arg,
      //           });
      //         }
      //       }
      //       // Implement your logic for "set" action
      //       break;
      //     default:
      //       break;
      //   }
      // }

      // Implement your logic for "set" action
    },
    [widgetUid]
  );

  // Then, when the session or visitor is created, process the queue
  useEffect(() => {
    if (activeSession?.session_uid) {
      while (sessionSetQueue.length > 0) {
        // const data = sessionSetQueue.shift();
        // socketManager.setSessionData({
        //   widget_uid: widgetUid,
        //   session_uid: activeSession?.session_uid,
        //   ...data,
        // });
      }
    }
  }, [activeSession, widgetUid]);

  // useEffect(() => {
  //   if (visitorUid) {
  //     while (visitorSetQueue.length > 0) {
  //       const data = visitorSetQueue.shift();
  //       socketManager.setVisitorData({
  //         widget_uid: widgetUid,
  //         visitor_uid: visitorUid,
  //         ...data,
  //       });
  //     }
  //   }
  // }, [visitorUid, widgetUid]);

  // useEffect(() => {
  //   if (visitorUid) {
  //     while (contactSetQueue.length > 0) {
  //       const data = contactSetQueue.shift();
  //       socketManager.setContactData({
  //         widget_uid: widgetUid,
  //         visitor_uid: visitorUid,
  //         ...data,
  //       });
  //     }
  //   }
  // }, [visitorUid, widgetUid]);

  const handleExecute = useCallback(
    (method: Method, args: any) => {
      if (method === "widget:open") {
        setChatbotPopup(true);
      }
      if (method === "widget:close") {
        setChatbotPopup(false);
      }

      if (method === "message:send") {
        if (args && args?.text) {
          setExecution({
            data: {
              text: args.text,
              send: args.send,
            },
            type: "message:send",
          });
          setChatbotPopup(true);
        }
      }
    },
    [setChatbotPopup]
  );

  const handleOn = useCallback((method: Method, arg: any) => {
    if (typeof arg === "function") {
      listeners[method] = [...(listeners[method] || []), arg];
    }
  }, []);

  const handleOff = useCallback((method: Method, arg: any) => {
    if (typeof arg === "function") {
      const callbacks = listeners[method] || [];
      listeners[method] = callbacks.filter((callback: any) => callback !== arg);
    }
  }, []);

  const push = useCallback(
    ([action, method, arg]: [Action, Method, any]) => {
      switch (action) {
        case "set":
          handleSet(method, arg);
          break;
        case "execute":
          handleExecute(method, arg);
          break;
        case "on":
          handleOn(method, arg);
          break;
        case "off":
          handleOff(method, arg);
          break;
      }
    },
    [handleSet, handleExecute, handleOn, handleOff]
  );

  useEffect(() => {
    if (sessionCreated) {
      const init = listeners.init || [];
      init.forEach((callback: any) => {
        callback();
      });
    }
  }, [sessionCreated]);

  useEffect(() => {
    const widgetPopup = listeners["widget:popup"] || [];
    widgetPopup.forEach((callback: any) => {
      callback(chatbotPopup);
    });
  }, [chatbotPopup]);

  // const handleMessageReceived = useCallback((data: any) => {
  //   const messageReceived = listeners["message:received"] || [];
  //   messageReceived.forEach((callback: any) => {
  //     callback(data);
  //   });
  // }, []);

  // useEffect(() => {
  //   if (socketConnected) {
  //     socketManager.socket.on(SocketListenE.messageReceived, handleMessageReceived);
  //   } else {
  //     socketManager.socket.off(SocketListenE.messageReceived, handleMessageReceived);
  //   }

  //   return () => {
  //     socketManager.socket.off(SocketListenE.messageReceived, handleMessageReceived);
  //   };
  // }, [socketConnected, handleMessageReceived]);

  useEffect(() => {
    const pendingActions = window?.$yourgptChatbot?.q || [];
    pendingActions.forEach((action: any) => {
      push(action);
    });
    window.$yourgptChatbot = {
      push,
      execute: handleExecute,
      on: handleOn,
      off: handleOff,
      set: handleSet,
    };
  }, [push, handleExecute, handleOn, handleOff, handleSet]);

  return null;
}

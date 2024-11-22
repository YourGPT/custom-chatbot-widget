import React, { useCallback, useEffect, useState } from "react";
import { MessageD, MessagesLoadingStatus, onMessagePayloadD } from "../../../types/message";
import { DOMAIN, useChatbot } from "../../../context/ChatbotContext";
import { StorageManager } from "../../../utils/storage";
// import socketManager from "../../../utils/socket";
import { SessionData } from "../../../types/socket";
// import { SocketListenE } from "../../../types/enum/socket";
// import useHandleMessageReceived from "../../../hooks/useReceivedMessageHandle";
import { useWidget } from "../../../context/WidgetContext";
// import { useEditedMessageHandle } from "../../../hooks/useEditedMessageHandle";
import { createSessionApi, getSessionMessagesApi } from "../../../network/api";
import { ApiRes } from "../../../types/enum";
import { isSessionDataValid } from "../../../utils/helper";
import useMessageStore from "../../../store/useMessageStore";
import pusherSubscriber from "../../../utils/PusherSubscriber";

let LOADER_TIMEOUT: any = null;
export const LOADER_TIMEOUT_LIMIT: number = 1000 * 30;

type CompactContextType = {
  messages: MessageD[];
  // setMessages: React.Dispatch<React.SetStateAction<MessageD[]>>;
  setMessages: (payload: MessageD[]) => void;
  onMessageSend: (message: onMessagePayloadD) => void;
  loadingStatus: MessagesLoadingStatus;
  clearSession: () => any;
  leadTempMessage: string;
  setLeadTempMessage: React.Dispatch<React.SetStateAction<string>>;
  leadPending: boolean;
  setLeadPending: React.Dispatch<React.SetStateAction<boolean>>;
  sessionData: SessionData | null;
  // notifyTyping: (message: string) => void;
  // onMessageActionBtn?: (data: onMessageActionBtnPayloadD) => any;
  creatingSession: boolean;
  createSession: () => any;
};

const CompactContext = React.createContext<CompactContextType>({} as CompactContextType);

// let DELIVERED_SET = false;

export const useCompactChatbot = () => React.useContext(CompactContext);

export default function CompactChatbotProvider({ children }: { children: React.ReactNode }) {
  const { chatbotPopup, widgetUid, deletedSession, setActiveSession, setUnseenMessageCount, toSendMessageQueue, setToSendMessageQueue, activeSession, setFollowUpQuestions } = useChatbot();
  const { setting } = useWidget();
  const setFollowUps = useMessageStore((state) => state.setFollowUps);

  /**
  /**
   * CONFIG
   */

  // const [messages, setMessages] = useState<MessageD[]>([]);
  const messages = useMessageStore((state) => state.messages);
  const setMessages = useMessageStore((state) => state.setMessages);

  // useEffect(() => {
  //   console.log("messages", messages);
  // }, [messages]);

  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  const [, setPendingMessageQueue] = useState<any[]>([]);

  const [loadingStatus, setLoadingStatus] = useState<MessagesLoadingStatus>(null);
  const onNMessageSend = useMessageStore((state) => state.sendMessage);

  //TEMP STATES

  // const handleMessageReceived = useHandleMessageReceived({
  //   chatbotPopup,
  //   widgetUid,
  //   messages,
  //   sessionData,
  //   setLoadingStatus,
  //   setMessages,
  // });

  function onMessageReceived(data: any) {
    // setLoadingStatus(null);

    const message = data?.message || null;

    // console.log("message", message);

    if (!message?.id && message?.response_source !== "studio_response") return;

    const nMessages = [...messages];
    if (nMessages.length > 1) {
      if (nMessages[nMessages.length - 1]?.loadingStatus === "loading") {
        nMessages.pop();
      }
    }
    const index = nMessages.findIndex((i) => i?.id === message?.id);
    if (index >= 0) {
      nMessages[index] = message;
    } else {
      nMessages.push(message);
    }
    setMessages(nMessages);
  }

  // const handleMessageEdited = useEditedMessageHandle({ messages, setMessages });
  // const { locale } = useLanguage();

  useEffect(() => {
    pusherSubscriber.subscribe(`${widgetUid}-${activeSession?.id}`, "message:received", onMessageReceived);

    return () => {
      pusherSubscriber.unsubscribe(`${widgetUid}-${activeSession?.id}`);
    };
  }, [widgetUid, onMessageReceived, activeSession]);

  /**
   * LEAD
   */
  const [leadTempMessage, setLeadTempMessage] = useState("");
  const [leadPending, setLeadPending] = useState(false);

  useEffect(() => {
    const stored = StorageManager.getStorage(widgetUid);

    if (!stored?.leadSubmitted) {
      if (setting?.enable_widget_form) {
        setLeadPending(true);
      }
    }
  }, [setting, widgetUid]);

  const [creatingSession, setCreatingSession] = useState(false);
  // const createSession = useCallback(() => {
  //   if (visitorUid && widgetUid && (chatbotPopup || isFullPage) && !creatingSession) {
  //     const deviceLocale = getDeviceLocale();
  //     setCreatingSession(true);
  //     socketManager.createSession({
  //       widget_uid: widgetUid,
  //       visitor_uid: visitorUid,
  //       language: deviceLocale,
  //     });
  //   }
  // }, [visitorUid, widgetUid, chatbotPopup, isFullPage, creatingSession]);

  const createSession = useCallback(async () => {
    const stored = StorageManager.getStorage(widgetUid);
    if (stored?.compactLayout?.sessionData?.session_uid) {
      setSessionData(stored?.compactLayout?.sessionData?.session_uid);
    } else {
      if (!widgetUid || !DOMAIN || creatingSession) {
        return;
      }
      try {
        setCreatingSession(true);
        const res = await createSessionApi({
          domain: DOMAIN,
          widget_uid: widgetUid,
        });
        if (res?.type === ApiRes.SUCCESS) {
          console.log("Session created", res.data);
          setSessionData(res.data);
        }
      } catch (error) {
        console.log("Error creating session", error);
      } finally {
        setCreatingSession(false);
      }
    }
  }, [widgetUid]);

  /**
   * EXTRA
   */

  /**
   * STORAGE MANAGER
   */
  useEffect(() => {
    if (sessionData && widgetUid) {
      StorageManager.setStorage({
        widgetUid,
        compactSession: sessionData,
      });
    }
  }, [sessionData, widgetUid]);

  useEffect(() => {
    if (messages.length > 0 && widgetUid) {
      if (messages.some((i) => !i?.message_id && !i?.id)) return;
      StorageManager.setStorage({
        compactMessages: messages,
        widgetUid,
      });
    }
  }, [messages, widgetUid]);

  const [, setLoadingMessages] = useState(false);

  const fetchMessages = useCallback(async () => {
    // Set delivered check to true
    // if (visitorUid && widgetUid && !DELIVERED_SET) {
    //   socketManager.messagesDelivered({
    //     visitor_uid: visitorUid,
    //     widget_uid: widgetUid,
    //   });
    //   DELIVERED_SET = true;
    // }

    if (!sessionData?.session_uid) return;

    try {
      setLoadingMessages(true);
      const res = await getSessionMessagesApi({
        session_uid: sessionData.session_uid,
        limit: 200,
        page: 1,
      });

      const unseenCount = res.data.filter((i: any) => i?.send_by === "operator" && i.seen === "0")?.length;

      if (unseenCount > 0) {
        setUnseenMessageCount(unseenCount);
      }

      setLoadingMessages(false);
      if (res.type === ApiRes.SUCCESS) {
        // socketManager.messsagesMarkSeen({
        //   session_uid: sessionData.session_uid,
        //   widget_uid: widgetUid,
        //   visitor_uid: visitorUid,
        // });
        if (res.data.length > 0) {
          setMessages(res.data);
          // setMessages((s) => {
          //   const newMessages = res.data || [];
          //   //filter out messages that are already in state
          //   const filteredMessages = newMessages.filter((i: any) => {
          //     console.log("i", i);
          //     console.log("JJJ", s);
          //     const isExist = s.find((j) => j?.id === i?.id);
          //     return !isExist;
          //   });
          //   return [...s, ...filteredMessages];
          // });

          // setMessages((s) => {
          //   //check if s  has any message with id of res.data
          //   const newMessages = res.data.filter((i: any) => {
          //     const isExist = s.find((j) => j?.id === i?.id);
          //     return !isExist;
          //   });
          //   if (newMessages.length > 0) {
          //     return s;
          //   } else {
          //     return res.data;
          //   }
          // });
        }
      }
    } catch (err) {
      setLoadingMessages(false);
      console.log("Err", err);
    }
  }, [sessionData?.session_uid, widgetUid]);

  //detect local storage changes and get real time location object

  // :TODO:
  // useEffect(() => {
  //   const handleChange = (e: StorageEvent) => {
  //     const stored = StorageManager.getStorage(widgetUid);
  //     // console.log("storage change", stored?.compactLayout.messages);
  //     setMessages(stored?.compactLayout.messages || []);
  //     setSessionData(stored?.compactLayout.sessionData || null);
  //   };

  //   window.addEventListener("storage", handleChange);
  //   return () => {
  //     window.removeEventListener("storage", handleChange);
  //   };
  // }, [widgetUid]);

  useEffect(() => {
    if (widgetUid) {
      const stored = StorageManager.getStorage(widgetUid);
      if (stored?.compactLayout?.messages && Array.isArray(stored.compactLayout.messages)) {
        setMessages(stored.compactLayout.messages);
      }
      if (stored?.compactLayout?.sessionData) {
        if (isSessionDataValid(stored.compactLayout.sessionData)) {
          setSessionData(stored.compactLayout.sessionData);
          // if (chatbotPopup) {
          fetchMessages();
          // }
        }
      }
    }
  }, [widgetUid, fetchMessages]);

  useEffect(() => {
    if (chatbotPopup) {
      fetchMessages();
    }
  }, [chatbotPopup, fetchMessages]);

  useEffect(() => {
    if (widgetUid) {
      const stored = StorageManager.getStorage(widgetUid);
      if (stored?.compactLayout?.sessionData) {
        if (!isSessionDataValid(stored.compactLayout.sessionData)) {
          createSession();
        }
      } else {
        createSession();
      }
    }
  }, [createSession, widgetUid]);

  const clearSession = useCallback(() => {
    setSessionData(null);
    setMessages([]);
    setLeadTempMessage("");
    setFollowUps([]);
    setFollowUpQuestions({});
    // setLeadPending(setting?.enable_widget_form ? true : false);
    StorageManager.clearCompactSession(widgetUid);
    createSession();
  }, [setting, widgetUid, createSession]);

  /**
   * SOCKET HANDLES
   */

  // useEffect(() => {
  //   if (pendingMessageQueue.length > 0 && sessionData) {
  //     pendingMessageQueue.forEach((i) => {
  //       if (!i.message?.trim()) return;
  //       socketManager.sendMessage({
  //         widget_uid: widgetUid,
  //         message: i.message?.trim(),
  //         session_uid: sessionData.session_uid,
  //         is_stream: setting?.is_stream === "1" ? true : false,
  //         content_type: "text",
  //       });
  //     });
  //     setPendingMessageQueue([]);
  //   }
  // }, [pendingMessageQueue, widgetUid, sessionData, setting?.is_stream]);

  // const handleMessageCompose = useCallback((data: MessageComposeD) => {
  //   if (data.type == "start" && data.content?.type === "loading") {
  //     setLoadingStatus("loading");
  //   }
  // }, []);

  const sendMessage = useCallback(
    (message: string) => {
      if (!message?.trim()) {
        return;
      }

      if (!sessionData) {
        // createSession();
        // setPendingMessageQueue((s) => [...s, {...message,}]);
        setPendingMessageQueue((s) => [
          ...s,
          {
            message: message,
            localId: Date.now(),
            createdAt: Date.now(),
            send_by: "user",
          },
        ]);
      }

      // setMessages([
      //   ...messages,
      //   {
      //     localId: Date.now(),
      //     loadingStatus: null,
      //     message: message,
      //     send_by: "user",
      //     createdAt: Date.now(),
      //   },
      // ]);

      onNMessageSend({
        message,
        sessionUid: sessionData?.session_uid,
        widgetUid,
        showSuggestedQs: setting?.layout?.followUpSuggestions || false,
        shouldStream: setting?.is_stream === "1" ? true : false,
        setThinking: (a: any) => {
          setLoadingStatus(a || null);
        },
      });

      // if (sessionData && message?.trim()) {
      //   socketManager.sendMessage({
      //     widget_uid: widgetUid,
      //     message: message,
      //     session_uid: sessionData?.session_uid,
      //     content_type: "text",
      //     is_stream: setting?.is_stream === "1" ? true : false,
      //   });
      // }
    },
    [sessionData, widgetUid, setting]
  );

  //
  const onMessageSend = useCallback(
    (d: onMessagePayloadD) => {
      if (d.content_type === "text" && d?.message?.trim()) {
        sendMessage(d.message);
      }
      // if (d.content_type === "image") {
      //   if (!sessionData?.session_uid) return;

      //   setMessages((s) => [
      //     ...s,
      //     {
      //       send_by: "user",
      //       localId: Date.now(),
      //       loadingStatus: null,
      //       createdAt: Date.now(),
      //       ...d,
      //     },
      //   ]);
      //   // socketManager.sendMessage({
      //   //   widget_uid: widgetUid,
      //   //   session_uid: sessionData?.session_uid,
      //   //   is_stream: setting?.is_stream === "1" ? true : false,
      //   //   ...d,
      //   // });
      // }
      // if (d.content_type === "audio") {
      //   if (!sessionData?.session_uid) return;

      //   setMessages((s) => [
      //     ...s,
      //     {
      //       send_by: "user",
      //       localId: Date.now(),
      //       // loadingStatus: "loading",
      //       createdAt: Date.now(),
      //       ...d,
      //     },
      //   ]);
      //   // socketManager.sendMessage({
      //   //   widget_uid: widgetUid,
      //   //   session_uid: sessionData?.session_uid,
      //   //   is_stream: setting?.is_stream === "1" ? true : false,
      //   //   ...d,
      //   // });
      // }
    },
    [sendMessage, sessionData, widgetUid, setting?.is_stream]
  );

  // const onMessageActionBtn = useCallback(
  //   (d: onMessageActionBtnPayloadD) => {
  //     if (!sessionData?.session_uid || !d.messageId) return;
  //     socketManager.messageUpdateAction({
  //       message_id: d.messageId.toString(),
  //       session_uid: sessionData?.session_uid,
  //       visitor_uid: visitorUid,
  //       widget_uid: widgetUid,
  //       choices: d.action,
  //     });

  //     setMessages((s) => {
  //       return s.map((i) => {
  //         if (!i) return i;
  //         if (i.message_id === d.messageId || i.id === d.messageId) {
  //           return {
  //             ...i,
  //             choices: d.action,
  //           };
  //         } else {
  //           return i;
  //         }
  //       });

  //       // if (d.index) {
  //       //   const newMessages = [...s];
  //       //   newMessages[d.index] = {
  //       //     ...newMessages[d.index],
  //       //     choices: d.action,
  //       //   };
  //       //   return newMessages;
  //       // } else {
  //       //   return s.map((i) => {
  //       //     if (i.message_id === d.messageId) {
  //       //       return {
  //       //         ...i,
  //       //         choices: d.action,
  //       //       };
  //       //     } else {
  //       //       return i;
  //       //     }
  //       //   });
  //       // }
  //     });
  //   },
  //   [widgetUid, sessionData]
  // );

  // const handleSessionCreated = useCallback((data: SessionData) => {
  //   setCreatingSession(false);
  //   setSessionData(data);
  // }, []);

  // const handleMessageDeleted = useCallback((data: any) => {
  //   const toDeleteId = data?.message_id;
  //   setMessages(
  //     messages.filter((i) => {
  //       if (Number(toDeleteId) === i?.id) {
  //         return false;
  //       } else {
  //         return true;
  //       }
  //     })
  //   );
  // }, []);

  useEffect(() => {
    if (deletedSession && deletedSession.session_uid === sessionData?.session_uid) {
      clearSession();
    }
  }, [deletedSession, clearSession, sessionData]);

  // useEffect(() => {
  //   socketManager.socket.on(SocketListenE.sessionCreated, handleSessionCreated);
  //   socketManager.socket.on(SocketListenE.messageReceived, handleMessageReceived);
  //   socketManager.socket.on(SocketListenE.messageCompose, handleMessageCompose);
  //   socketManager.socket.on(SocketListenE.messageEdited, handleMessageEdited);
  //   socketManager.socket.on(SocketListenE.messageDeleted, handleMessageDeleted);

  //   return () => {
  //     socketManager.socket.off(SocketListenE.sessionCreated, handleSessionCreated);
  //     socketManager.socket.off(SocketListenE.messageReceived, handleMessageReceived);
  //     socketManager.socket.off(SocketListenE.messageCompose, handleMessageCompose);
  //     socketManager.socket.off(SocketListenE.messageEdited, handleMessageEdited);
  //     socketManager.socket.off(SocketListenE.messageDeleted, handleMessageDeleted);
  //   };
  // }, [handleSessionCreated, handleMessageReceived, handleMessageCompose, handleMessageEdited, handleMessageDeleted]);

  // const notifyTyping = useCallback(
  //   (message: string) => {
  //     if (!sessionData?.session_uid) return;

  //     socketManager.sendCompose({
  //       send_by: "user",
  //       session_uid: sessionData?.session_uid,
  //       widget_uid: widgetUid,
  //       type: message ? "start" : "stop",
  //       content: {
  //         type: "typing",
  //         message,
  //       },
  //     });
  //   },
  //   [widgetUid, sessionData]
  // );

  //if loading status is loading for 30 seconds call fetch mesages api and stop loading
  useEffect(() => {
    if (loadingStatus === "loading") {
      LOADER_TIMEOUT = setTimeout(() => {
        setLoadingStatus(null);
        fetchMessages();
      }, LOADER_TIMEOUT_LIMIT);
    } else {
      if (LOADER_TIMEOUT) {
        clearTimeout(LOADER_TIMEOUT);
      }
    }
    return () => {
      if (LOADER_TIMEOUT) {
        clearTimeout(LOADER_TIMEOUT);
      }
    };
  }, [loadingStatus, fetchMessages]);

  useEffect(() => {
    setActiveSession(sessionData);
  }, [sessionData]);

  useEffect(() => {
    if (toSendMessageQueue.length > 0) {
      const triggerLastMessage = toSendMessageQueue[toSendMessageQueue.length - 1];
      if (triggerLastMessage && triggerLastMessage?.trim()) {
        sendMessage(triggerLastMessage);
      }

      setToSendMessageQueue([]);
    }
  }, [toSendMessageQueue, sendMessage]);

  return (
    <CompactContext.Provider
      value={{
        creatingSession,
        messages,
        setMessages,
        onMessageSend,
        loadingStatus,
        clearSession,
        leadTempMessage,
        setLeadTempMessage,
        leadPending,
        setLeadPending,
        sessionData,
        // notifyTyping,
        // onMessageActionBtn,
        createSession,
      }}
    >
      {children}
    </CompactContext.Provider>
  );
}

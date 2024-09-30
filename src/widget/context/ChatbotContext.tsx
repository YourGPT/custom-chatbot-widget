import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ChatbotSettingD, WidgetPlace } from "../types";
import { MessageEventResponse, SessionData } from "../types/socket";
import { StorageManager } from "../utils/storage";
import { getChatbotCreds } from "../utils/helper";
import { useSettings } from "../hooks/useSettings";
import ChatbotEmitters from "../containers/SdkManager";
import useMessageStore from "../store/useMessageStore";

declare global {
  interface Window {
    YOURGPT_PROJECT_UID: string;
    YOURGPT_WIDGET_UID: string;
  }
}

//declaare a global type for accessing navigation object with any type
declare const navigation: any;

type DeletedSessionD = {
  session_uid: string;
} | null;

export type FollowUpQuestionsD = {
  [key: string]: any[];
};
type ExecutionD = {
  type: "message:send";
  data: {
    text: string;
    send?: boolean;
  };
};

export type TriggerMessage = {
  messages: string[];
  questions?: string[];
  allowCustomQuestion?: boolean;
  trigger: any;
};

type ChatbotContextType = {
  chatbotSettings: ChatbotSettingD | null;
  isFullPage: boolean;
  chatbotPopup: boolean;
  setChatbotPopup: React.Dispatch<React.SetStateAction<boolean>>;
  widgetUid: string;
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  browserTabActive: boolean;
  loadingChatbotSettings: boolean;
  widgetPlace: WidgetPlace;
  // visitorUid: string;
  // socketConnected: boolean;
  // socketDisconnected: boolean;
  unseenMessages: MessageEventResponse[];
  clearUnseenMessages: () => any;
  interacted: boolean;
  onWelcomePopupClick: (openChatbot?: boolean) => any;
  deletedSession: DeletedSessionD;
  activeSession: SessionData | null;
  setActiveSession: React.Dispatch<React.SetStateAction<SessionData | null>>;
  followUpQuestions: FollowUpQuestionsD;
  setFollowUpQuestions: React.Dispatch<React.SetStateAction<FollowUpQuestionsD>>;
  execution: ExecutionD | null;
  setExecution: React.Dispatch<React.SetStateAction<ExecutionD | null>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  // blocked: boolean;
  unseenMessageCount: number;
  setUnseenMessageCount: React.Dispatch<React.SetStateAction<number>>;
  triggerMessages: TriggerMessage | null;
  setTriggerMessages: React.Dispatch<React.SetStateAction<TriggerMessage | null>>;
  toSendMessageQueue: string[];
  setToSendMessageQueue: React.Dispatch<React.SetStateAction<string[]>>;
  sessionCreated: boolean;
  setSessionCreated: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatbotContext = React.createContext<ChatbotContextType>({} as ChatbotContextType);

export const useChatbot = () => useContext(ChatbotContext);
export const DOMAIN = "https://widget.yourgpt.ai";

export default function ChatbotProvider({ children, widgetPlace, widgetUid }: { children: React.ReactNode; widgetPlace: WidgetPlace; widgetUid: string }) {
  const isFullPage = useMemo(() => (getChatbotCreds()?.fullPage ? true : false), []);

  /**
   * CONFIG
   */

  // const [visitorUid, setVisitorUid] = useState("");

  const { chatbotSettings, loadingChatbotSettings } = useSettings({ widgetUid });

  const [expanded, setExpanded] = useState(false);

  const [browserTabActive, setBrowserTabActive] = useState(true);

  const [interacted, setInteracted] = useState(false);
  // const [socketError, setSocketError] = useState(false);
  //TEMP STATES
  const [chatbotPopup, setChatbotPopup] = useState(widgetPlace === "showcase" || isFullPage ? true : false);

  const [deletedSession] = useState<DeletedSessionD>(null);
  const [activeSession, setActiveSession] = useState<SessionData | null>(null);

  const [followUpQuestions, setFollowUpQuestions] = useState<FollowUpQuestionsD>({});
  const followUps = useMessageStore((state) => state.followUps);
  const [execution, setExecution] = useState<ExecutionD | null>(null);

  useEffect(() => {
    if (!activeSession) return;
    setFollowUpQuestions((s) => ({ ...s, [activeSession?.session_uid]: followUps }));
  }, [followUps, activeSession]);

  const [error, setError] = useState<any>(null);
  // const [blocked, setBlocked] = useState(false);
  // const [hideBot, setHideBot] = useState(false);

  /**
   * EXTRA
   */

  const [unseenMessages, setUnseenMessages] = useState<MessageEventResponse[]>([]);
  const [unseenMessageCount, setUnseenMessageCount] = useState(0);

  const [triggerMessages, setTriggerMessages] = useState<TriggerMessage | null>(null);

  const [toSendMessageQueue, setToSendMessageQueue] = useState<string[]>([]);

  const [sessionCreated, setSessionCreated] = useState(false);

  // useEffect(() => {
  //   const stored = StorageManager.getStorage(widgetUid);
  //   if (stored?.visitorUid && isNumeric(stored?.visitorUid)) {
  //     setVisitorUid(stored.visitorUid);
  //   } else {
  //     if (widgetUid) {
  //       socketManager.createVisitor({
  //         widget_uid: widgetUid,
  //       });
  //     }
  //   }
  //   return () => {};
  // }, [widgetUid]);

  useEffect(() => {
    if (toSendMessageQueue.length > 0) {
      setChatbotPopup(true);
    }
  }, [toSendMessageQueue]);

  useEffect(() => {
    if (activeSession || unseenMessages.length > 0) {
      setTriggerMessages(null);
    }
  }, [activeSession, unseenMessages]);

  useEffect(() => {
    if (sessionCreated) {
      StorageManager.setStorage({
        widgetUid: widgetUid,
        sessionCreated: true,
      });
    }
  }, [widgetUid, sessionCreated]);

  useEffect(() => {
    if (activeSession) {
      setSessionCreated(true);
    }
  }, [activeSession, widgetUid]);

  // useEffect(() => {
  //   // setUnseenMessageCount(unseenMessages.length);
  // }, [unseenMessages]);

  useEffect(() => {
    document.addEventListener("visibilitychange", () => {
      setBrowserTabActive(document.visibilityState === "visible");
    });
  }, []);

  useEffect(() => {
    if (StorageManager.getStorage(widgetUid)?.interacted) {
      setInteracted(true);
    } else {
      setInteracted(false);
    }
  }, [widgetUid]);

  useEffect(() => {
    if (chatbotPopup) {
      setInteracted(true);
      StorageManager.setStorage({
        interacted: true,
        widgetUid,
      });
    }
  }, [chatbotPopup, widgetUid]);

  // useEffect(() => {
  //   if (visitorUid && widgetUid) {
  //     socketManager.joinVisitor({
  //       visitor_uid: visitorUid,
  //       widget_uid: widgetUid,
  //     });
  //   }
  // }, [visitorUid, widgetUid]);

  // useEffect(() => {
  //   // const handleLocationChange = () => {
  //   //   if (widgetUid) {
  //   //     socketManager.navigation({
  //   //       page_title: document.title,
  //   //       url: window.location.href,
  //   //       widget_uid: widgetUid,
  //   //     });
  //   //   }
  //   // };

  //   if (typeof navigation !== "undefined") {
  //     handleLocationChange();
  //     navigation?.addEventListener("navigate", handleLocationChange);
  //   }

  //   return () => {
  //     if (typeof navigation !== "undefined") {
  //       navigation?.removeEventListener("navigate", handleLocationChange);
  //     }
  //   };
  // }, [widgetUid]);

  /**
   * SOCKET HANDLES
   */

  // const handleVisitorCreated = useCallback(
  //   (data: any) => {
  //     setVisitorUid(data.visitor_uid);
  //     StorageManager.setStorage({
  //       visitorUid: data.visitor_uid,
  //       widgetUid,
  //     });
  //   },
  //   [widgetUid]
  // );

  // const handleMessageReceived = useCallback(
  //   (data: MessageEventResponse) => {
  //     if (!chatbotPopup && !isFullPage) {
  //       playSound();
  //       setUnseenMessages((s) => [...s, data]);
  //     }
  //   },
  //   [chatbotPopup, isFullPage]
  // );

  // const handleConnected = useCallback(() => {
  //   // setSocketError(false);
  //   setSocketConnected(true);
  //   setSocketDisconnected(false);
  // }, []);

  // const handleDisconnect = useCallback(() => {
  //   setSocketConnected(false);
  //   setSocketDisconnected(true);
  // }, []);
  // const handleSocketError = useCallback((e: any) => {
  //   console.log("SOCKET ERROR", e);
  //   setSocketError(true);
  // }, []);

  // const handleSessionDeleted = useCallback((data: any) => {
  //   setDeletedSession(data);
  //   // setDeletedSession(null);
  // }, []);

  // const [invalidVisitor, setInvalidVisitor] = useState(false);

  // const handleInvalidVisitor = useCallback(() => {
  //   setVisitorUid("");
  //   StorageManager.clearStorage(widgetUid);
  //   console.log("INVALID VISITOR 3", widgetUid);
  //   if (widgetUid) {
  //     socketManager.createVisitor({
  //       widget_uid: widgetUid,
  //     });
  //   }
  // }, [widgetUid]);

  // useEffect(() => {
  //   if (invalidVisitor) {
  //     console.log("INVALID VISITOR 2");
  //     handleInvalidVisitor();
  //   }
  // }, [invalidVisitor, handleInvalidVisitor]);

  // const handleError = useCallback((data: any) => {
  //   if (data.type === ApiRes.ERROR) {
  //     //INVALID VISITOR
  //     if (data.code === 505) {
  //       console.log("INVALID VISITOR 1");
  //       setInvalidVisitor(true);
  //     }

  //     //SESSION THROTTLING
  //     if (data.code === 429) {
  //       setError(data.message);
  //     }
  //   }
  // }, []);

  // const handleBlockedVisitor = useCallback(() => {
  //   setBlocked(true);
  //   setTimeout(() => {
  //     setHideBot(true);
  //   }, 2000);
  // }, []);
  // const handleUnblockedVisitor = useCallback(() => {
  //   setBlocked(false);
  //   setHideBot(false);
  // }, []);

  // useEffect(() => {
  //   socketManager.socket.on(SocketListenE.messageReceived, handleMessageReceived);
  //   socketManager.socket.on(SocketListenE.connect, handleConnected);
  //   socketManager.socket.on(SocketListenE.disconnect, handleDisconnect);
  //   socketManager.socket.on(SocketListenE.visitorCreated, handleVisitorCreated);
  //   socketManager.socket.on(SocketListenE.sessionDeleted, handleSessionDeleted);
  //   socketManager.socket.on(SocketListenE.visitorBlocked, handleBlockedVisitor);
  //   socketManager.socket.on(SocketListenE.visitorUnblocked, handleUnblockedVisitor);
  //   socketManager.socket.on("error", handleError);

  //   // socketManager.socket.on("error", handleSocketError);

  //   return () => {
  //     socketManager.socket.off(SocketListenE.messageReceived, handleMessageReceived);
  //     socketManager.socket.off(SocketListenE.connect, handleConnected);
  //     socketManager.socket.off(SocketListenE.visitorCreated, handleVisitorCreated);
  //     socketManager.socket.off(SocketListenE.sessionDeleted, handleSessionDeleted);
  //     socketManager.socket.off(SocketListenE.visitorBlocked, handleBlockedVisitor);
  //     socketManager.socket.off(SocketListenE.visitorUnblocked, handleUnblockedVisitor);
  //     socketManager.socket.off("error", handleError);

  //     // socketManager.socket.off("error", handleSocketError);
  //   };
  // }, [handleMessageReceived, handleConnected, handleVisitorCreated, handleDisconnect, handleSessionDeleted, handleInvalidVisitor, handleError, handleBlockedVisitor, handleUnblockedVisitor]);

  const clearUnseenMessages = useCallback(() => {
    setUnseenMessages([]);
    setUnseenMessageCount(0);
  }, []);

  useEffect(() => {
    if (chatbotPopup) {
      clearUnseenMessages();
    }
  }, [chatbotPopup, clearUnseenMessages]);

  const onWelcomePopupClick = useCallback(
    (openChatbot = true) => {
      setInteracted(true);
      StorageManager.setStorage({
        interacted: true,
        widgetUid,
      });
      if (openChatbot) {
        setChatbotPopup(true);
      }
    },
    [widgetUid]
  );

  // if (hideBot) {
  //   return null;
  // }

  return (
    <ChatbotContext.Provider
      value={{
        widgetUid,
        chatbotSettings,
        isFullPage,
        chatbotPopup,
        setChatbotPopup,
        expanded,
        setExpanded,
        browserTabActive,
        loadingChatbotSettings,
        widgetPlace,
        // visitorUid,
        // socketConnected,
        unseenMessages,
        clearUnseenMessages,
        interacted,
        onWelcomePopupClick,
        deletedSession,
        activeSession,
        setActiveSession,
        // socketDisconnected,
        followUpQuestions,
        setFollowUpQuestions,
        execution,
        setExecution,
        error,
        setError,
        // blocked,
        unseenMessageCount,
        setUnseenMessageCount,
        triggerMessages,
        setTriggerMessages,
        toSendMessageQueue,
        setToSendMessageQueue,
        sessionCreated,
        setSessionCreated,
      }}
    >
      {children}

      <ChatbotEmitters />
    </ChatbotContext.Provider>
  );
}

// import { generateFollowUpQuestionsApi, getSessionMessagesApi, sendMessageApi } from "@/network/api";
// import { MessageD } from "@/types";
// import { ApiResE } from "@/types/enum";
// import { handleStream } from "@/utils/streamer";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { MessageD } from "../types/message";
import { generateFollowUpQuestionsApi, getSessionMessagesApi, sendMessageApi } from "../network/api";
import { ApiRes } from "../types/enum";
import { handleStream } from "../utils/streamer";
import { FollowUpQuestionsD } from "../context/ChatbotContext";

const DOMAIN = "https://widget.yourgpt.ai";

type commonT = {
  sessionUid: string;
  widgetUid: string;
};

type sendMsgT = {
  message: string;
  showSuggestedQs: boolean;
  shouldStream?: boolean;
  setThinking: (payload: string | null) => void;
} & commonT;

type getFollowUpT = {
  messageId: string;
} & commonT;

type MesssageStore = {
  messages: MessageD[];
  generating: boolean;
  fetchingMsgs: boolean;
  thinking: boolean;
  followUps: FollowUpQuestionsD[];
  setGenerating: (payload: boolean) => void;
  getMessages: ({ sessionUid, widgetUid }: commonT) => void;
  sendMessage: ({ sessionUid, widgetUid, message, showSuggestedQs, setThinking }: sendMsgT) => void;
  getFollowUps: ({ messageId, sessionUid, widgetUid }: getFollowUpT) => void;
  setFollowUps: (payload: any[]) => void;
  setMessages: (payload: MessageD[]) => void;
};

const useMessageStore = create<MesssageStore>()(
  immer((set, get) => ({
    messages: [],
    followUps: [],
    // links: [],
    generating: false,
    fetchingMsgs: false,
    thinking: false,

    setGenerating: (payload: boolean) => {
      set((state) => {
        state.generating = payload;
      });
    },

    /*
    GET MESSAGES 
    */
    getMessages: async ({ sessionUid, widgetUid }: commonT) => {
      if (!sessionUid || !widgetUid) return;

      try {
        set((state) => {
          state.fetchingMsgs = true;
        });
        const res = await getSessionMessagesApi({
          session_uid: sessionUid || "",
          limit: 100,
          page: 1,
        });

        if (res?.type === ApiRes.SUCCESS) {
          set((state) => {
            state.messages = res.data;
          });
        }
      } catch (error) {
        console.log("Error fetching messages", error);
      } finally {
        set((state) => {
          state.fetchingMsgs = false;
        });
      }
    },

    setMessages: (payload: MessageD[]) => {
      set((state) => {
        state.messages = payload;
      });
    },

    /*
    SEND MESSAGE 
    */
    sendMessage: async ({ sessionUid, widgetUid, message, showSuggestedQs, shouldStream = false, setThinking }: sendMsgT) => {
      if (!sessionUid || !widgetUid || !message) return;
      set((state) => {
        state.followUps = [];
      });

      if (!message?.trim()) {
        return;
      }
      setThinking("loading");

      set((state) => {
        state.messages.push({
          localId: Date.now(),
          loadingStatus: null,
          message: message,
          send_by: "user",
          createdAt: Date.now(),
        });
      });

      try {
        const res = await sendMessageApi({
          session_uid: sessionUid || "",
          message,
          domain: DOMAIN,
          widget_uid: widgetUid,
          is_stream: shouldStream,
        });
        setThinking(null);

        if (res?.type === ApiRes.SUCCESS) {
          if (res?.data?.stream_url || res?.data?.stream_token) {
            await handleStream({
              data: res?.data,
              messages: get().messages,
              setMessages: (payload: MessageD[]) => {
                set((state) => {
                  state.messages = payload;
                });
              },
              getFollowUps: (msgId: string) => {
                if (!msgId || !showSuggestedQs) return;
                get().getFollowUps({ messageId: msgId, sessionUid, widgetUid });
              },
              setGenerating: get().setGenerating,
              setThinking: (payload: boolean) => {
                set((state) => {
                  state.thinking = payload;
                });
              },
            });
          } else {
            set((state) => {
              if (Array.isArray(res?.data)) {
                state.messages.push(...(res?.data || []));
              } else {
                const newMessage = res?.data || null;
                const lastMsg = state.messages[state.messages.length - 1];

                if (state.messages.length === 0 || lastMsg?.id !== newMessage?.id) {
                  newMessage && state.messages.push(newMessage);
                } else {
                  newMessage && (state.messages[state.messages.length - 1] = newMessage);
                }
              }
            });
          }
        }
      } catch (error) {
        console.log("Error sending message", error);
      }
    },

    /*
    GET FOLLOW UPS 
    */
    getFollowUps: async function getFollowUps({ messageId, sessionUid, widgetUid }: getFollowUpT) {
      if (!messageId || !sessionUid || !widgetUid) return;
      try {
        const res = await generateFollowUpQuestionsApi({
          message_id: messageId,
          session_uid: sessionUid,
          widget_uid: widgetUid,
        });
        if (res?.type === ApiRes.SUCCESS) {
          const parsedArray = JSON.parse(res.data.output || "[]");
          if (Array.isArray(parsedArray) && parsedArray.length > 0 && sessionUid) {
            set((state) => {
              return { ...state.followUps, followUps: parsedArray };
            });
          }
        }
      } catch (error) {
        console.log("Error fetching followups", error);
      }
    },

    /*
    SET FOLLOW UPS  
    */

    setFollowUps: (payload: any[]) => {
      set((state) => {
        state.followUps = payload;
      });
    },
  }))
);

export default useMessageStore;

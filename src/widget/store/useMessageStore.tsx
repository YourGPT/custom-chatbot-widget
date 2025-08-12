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
  streaming: Record<string, { id?: string; streamText: string; streaming: boolean }>;
  setGenerating: (payload: boolean) => void;
  getMessages: ({ sessionUid, widgetUid }: commonT) => void;
  sendMessage: ({ sessionUid, widgetUid, message, showSuggestedQs, setThinking }: sendMsgT) => void;
  getFollowUps: ({ messageId, sessionUid, widgetUid }: getFollowUpT) => void;
  setFollowUps: (payload: any[]) => void;
  setMessages: (payload: MessageD[]) => void;
  setStreamChunk: (payload: { id?: string; text: string; finished?: boolean }) => void;
  clearStream: (id: string) => void;
  clearAllStreams: () => void;
};

const useMessageStore = create<MesssageStore>()(
  immer((set, get) => ({
    messages: [],
    followUps: [],
    // links: [],
    generating: false,
    fetchingMsgs: false,
    thinking: false,
    streaming: {},

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

    setStreamChunk: ({ id, text, finished = false }: { id?: string; text: string; finished?: boolean }) => {
      set((state) => {
        const pendingKey = "__pending__";
        let targetKey = id || pendingKey;

        // Initialize entry if not present
        // Note: not using the 'existing' value beyond initialization to avoid linter warnings
        state.streaming[targetKey] = state.streaming[targetKey] || { id: id, streamText: "", streaming: true };
        // Since upstream sends full accumulated text, just set it
        state.streaming[targetKey] = { id, streamText: text, streaming: !finished };

        // If an id becomes available and we had pending, migrate and delete pending
        if (id && state.streaming[pendingKey]) {
          state.streaming[id] = { id, streamText: text, streaming: !finished };
          delete state.streaming[pendingKey];
        }

        if (finished) {
          if (id) {
            delete state.streaming[id];
          } else {
            delete state.streaming[pendingKey];
          }
        }
      });
    },

    clearStream: (id: string) => {
      set((state) => {
        if (state.streaming[id]) delete state.streaming[id];
        if (state.streaming["__pending__"]) delete state.streaming["__pending__"];
      });
    },

    clearAllStreams: () => {
      set((state) => {
        state.streaming = {};
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
              getFollowUps: (msgId: string) => {
                if (!msgId || !showSuggestedQs) return;
                get().getFollowUps({ messageId: msgId, sessionUid, widgetUid });
              },
              setGenerating: get().setGenerating,
              setThinking: (status: any) => {
                // Pass through to UI loadingStatus controller
                setThinking(status);
                // Maintain boolean thinking flag internally for any legacy usage
                set((state) => {
                  state.thinking = status === "loading" || status === "streaming";
                });
              },
              onUpdate: ({ text, messageId, finished }) => {
                get().setStreamChunk({ id: messageId, text, finished });
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

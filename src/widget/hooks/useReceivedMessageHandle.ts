import { useCallback, useEffect, useRef, useState } from "react";
import { MessageEventResponse, SessionData } from "../types/socket";
import { MessageD, MessagesLoadingStatus } from "../types/message";
// import socketManager from "../utils/socket";
import { getStreamData } from "../utils";
import { playSound } from "../utils/helper";
import { useChatbot } from "../context/ChatbotContext";
import { generateFollowUpQuestionsApi } from "../network/api";
import { ApiRes } from "../types/enum";
import { useWidget } from "../context/WidgetContext";

type SetMessages = React.Dispatch<React.SetStateAction<MessageD[]>>;

type UseHandleMessageReceivedArgs = {
  messages: MessageD[];
  setMessages: SetMessages;
  sessionData: SessionData | null;
  widgetUid: string;
  chatbotPopup?: boolean;
  setLoadingStatus: React.Dispatch<React.SetStateAction<MessagesLoadingStatus>>;
};

type UseHandleMessageReceived = (args: UseHandleMessageReceivedArgs) => (data: MessageEventResponse) => void;

const streamMessageIdMaps: any = {};
const messageQueue: any[] = [];
let isStreaming = false;

const useHandleMessageReceived: UseHandleMessageReceived = ({ messages, setMessages, sessionData, widgetUid, chatbotPopup = true, setLoadingStatus }) => {
  const [browserTabActive, setBrowserTabActive] = useState(true);
  const { setFollowUpQuestions, setError } = useChatbot();
  const { layout, setting } = useWidget();

  const sessionDataRef = useRef(sessionData);
  sessionDataRef.current = sessionData;

  useEffect(() => {
    document.addEventListener("visibilitychange", () => {
      setBrowserTabActive(document.visibilityState === "visible");
    });
  }, []);

  // useEffect(() => {
  //   if (chatbotPopup && browserTabActive && sessionData?.session_uid) {
  //     socketManager.messsagesMarkSeen({
  //       session_uid: sessionData?.session_uid,
  //       widget_uid: widgetUid,
  //       visitor_uid: visitorUid,
  //     });
  //   }
  // }, [chatbotPopup, sessionData, widgetUid, visitorUid, browserTabActive]);

  const generateFollowUpQuestions = useCallback(
    async ({ id }: { id: any }) => {
      try {
        if (!sessionData?.session_uid || !id || !widgetUid) return;
        const res = await generateFollowUpQuestionsApi({
          message_id: id.toString(),
          session_uid: sessionData.session_uid,
          widget_uid: widgetUid,
        });
        if (res.type === ApiRes.SUCCESS) {
          const parsedArray = JSON.parse(res.data.output || "[]");
          if (Array.isArray(parsedArray) && parsedArray.length > 0 && sessionData.session_uid) {
            setFollowUpQuestions((s) => ({ ...s, [sessionData.session_uid]: [...parsedArray] }));
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    [sessionData?.session_uid, widgetUid]
  );

  const handleMessageReceived = useCallback(
    (data: MessageEventResponse) => {
      setLoadingStatus(null);

      //CLEARING THROTTLE MESSAGE ERROR
      setError(null);

      if (!sessionData) {
        return;
      }

      if (data.session_uid !== sessionData.session_uid) {
        return;
      }

      // if (visitorUid && widgetUid) {
      //   socketManager.messagesDelivered({
      //     visitor_uid: visitorUid,
      //     widget_uid: widgetUid,
      //   });
      // }

      if (!browserTabActive) {
        playSound();
      }

      if (data?.send_by !== "user") {
        //remoe any message item having loadingStatus
        setMessages((s) => s.filter((m) => !m?.loadingStatus));
      }

      //check if message with id exist in messages
      const hasMessage = messages.find((m) => m?.id && data?.message_id && m?.id === data?.message_id);
      if (hasMessage) {
        return;
      }

      if (data?.send_by === "user") {
        //check last two messages if send by user then update the message_id
        setMessages((s) => {
          const newS = [...s];
          if (newS.length > 1 && newS[newS.length - 1]?.send_by === "user") {
            newS[newS.length - 1].id = data.message_id;
            newS[newS.length - 1].message_id = data.message_id;
          } else if (newS.length > 2 && newS[newS.length - 2]?.send_by === "user") {
            newS[newS.length - 2].message_id = data.message_id;
            newS[newS.length - 2].id = data.message_id;
          }
          return newS;
        });

        return;
      }

      // if (data.send_by !== "user") {
      //   //remoe any message item having loadingStatus
      //   const lastLoadingStatusIndex =

      //   if (lastLoadingStatusIndex >= 0) {
      //     setMessages((s) => {
      //       const newArr = [...s];
      //       newArr[lastLoadingStatusIndex] = {
      //         ...data,
      //         id: data.message_id,
      //         loadingStatus: null,
      //         localId: Date.now(),
      //         createdAt: Date.now(),
      //       };
      //       return newArr;
      //     });

      //     return;
      //   }
      //   //find index of last message with loadingStatus streaming
      // }

      // if (data?.send_by === "operator" && chatbotPopup && browserTabActive && sessionData?.session_uid) {
      //   socketManager.messsagesMarkSeen({
      //     session_uid: sessionData?.session_uid,
      //     widget_uid: widgetUid,
      //     visitor_uid: visitorUid,
      //   });
      // }

      //IF GET DIRECT MESSAGE ID
      let generatedMessageId: any = null;

      const getFollowUp = (id: any, stream = false) => {
        if ((data?.send_by === "assistant" || stream) && layout?.followUpSuggestions && id && !generatedMessageId) {
          generatedMessageId = id;
          generateFollowUpQuestions({ id });
        }
      };

      getFollowUp(data.message_id);

      if (data.type === "stream" && data?.stream_url) {
        //if tab is not active then return
        if (!browserTabActive) {
          return;
        }

        const streamIndex = messages.length;
        // const streamingMsgId = data.message_id;

        setMessages((s) => {
          const newMessages = [...s];
          newMessages.push({
            ...data,
            loadingStatus: "loading",
            localId: Date.now(),
            send_by: "assistant",
            stream: true,
            createdAt: null,
            message: "",
          });
          return newMessages;
        });

        let messageId: null | number = null;

        getStreamData({
          url: data.stream_url,
          token: data.stream_token,
          sessionUid: sessionData.session_uid,
          onUpdate: (res: any) => {
            if (res.sessionUid !== sessionDataRef.current?.session_uid) return;

            if (res.messageId) {
              messageId = res.messageId;
              getFollowUp(messageId, true);
            }

            setLoadingStatus(null);

            // if (res.messageId && data.choices) {
            //   socketManager.messageUpdateAction({
            //     message_id: res.messageId,
            //     session_uid: sessionData.session_uid,
            //     widget_uid: widgetUid,
            //     choices: data.choices,
            //     visitor_uid: visitorUid,
            //   });
            // }

            // socketManager.sendCompose({
            //   send_by: "assistant",
            //   session_uid: sessionData.session_uid,
            //   widget_uid: widgetUid,
            //   type: res.finished ? "stop" : "start",
            //   content: {
            //     message: res.res,
            //     type: "streaming",
            //     message_id: streamingMsgId || null,
            //     choices: messageId ? data.choices || [] : undefined,
            //   },
            // });

            setMessages((s) => {
              const newMessages = [...s];
              newMessages[streamIndex] = {
                ...newMessages[streamIndex],
                loadingStatus: res.finished ? null : "streaming",
                message: res.res,
                // message_id: Number(messageId || -1) || newMessages[streamIndex].message_id || 0,
                id: Number(messageId || -1) || newMessages[streamIndex].message_id || 0,
                createdAt: res.finished ? Date.now() : null,
                links: res?.links || newMessages[streamIndex]?.links || [],
              };

              return newMessages;
            });
          },
        });
      } else {
        if (setting?.is_stream !== "1") {
          setMessages((s) => {
            return [
              ...s,
              {
                ...data,
                id: data.message_id,
                loadingStatus: null,
                localId: Date.now(),
                createdAt: Date.now(),
              },
            ];
          });
        } else {
          if (data?.content_type !== "text") {
            setMessages((s) => {
              return [
                ...s,
                {
                  ...data,
                  id: data.message_id,
                  loadingStatus: null,
                  localId: Date.now(),
                  createdAt: Date.now(),
                },
              ];
            });
            return;
          }

          // IF TEXT ONLY MESSAGE SHOW ARTIFICIAL STREAMING

          const streamMessage = (data1: any, streamInd: number) => {
            isStreaming = true;

            const localStreamIndex = streamInd;

            let messageIndex = 0;
            const interval = setInterval(() => {
              if (messageIndex >= data1.message?.length) {
                clearInterval(interval);
                setMessages((s) => {
                  const newMessages = [...s];
                  newMessages[localStreamIndex] = {
                    ...data1,
                    message: data1.message,
                    id: data1.message_id,
                    loadingStatus: null,
                    localId: data1.message_id,
                    createdAt: Date.now(),
                  };
                  return newMessages;
                });

                // Remove the message from the queue and start streaming the next one
                if (messageQueue.length > 0) {
                  const nextMessage = messageQueue.shift();
                  streamMessage(nextMessage.data, nextMessage.streamIndex);
                } else {
                  isStreaming = false;
                }

                return;
              }

              setMessages((s) => {
                const newMessages = [...s];
                newMessages[localStreamIndex] = {
                  ...data1,
                  message: data1.message?.slice(0, messageIndex + 1),
                  id: data1.message_id,
                  loadingStatus: null,
                  localId: data1.message_id,
                  createdAt: Date.now(),
                };
                return newMessages;
              });

              messageIndex++;
            }, 15);
          };

          // If no message is currently being streamed, start streaming
          if (!isStreaming) {
            let localStreamIndex = 0;

            const msgID = data.message_id?.toString() as string;
            if (streamMessageIdMaps[msgID]) {
              localStreamIndex = +streamMessageIdMaps[msgID];
            } else {
              localStreamIndex = messages.length;
              streamMessageIdMaps[msgID] = localStreamIndex;
            }

            streamMessage(data, localStreamIndex);
          } else {
            // Add the message to the queue with its streamIndex
            messageQueue.push({ data: data, streamIndex: messages.length });
          }
        }
      }
    },

    [setMessages, sessionData, widgetUid, browserTabActive, chatbotPopup, setLoadingStatus, messages, generateFollowUpQuestions, layout?.followUpSuggestions]
  );

  useEffect(() => {
    sessionDataRef.current = sessionData;
  }, [sessionData]);

  return handleMessageReceived;
};

export default useHandleMessageReceived;

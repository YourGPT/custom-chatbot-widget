import Header from "./Header";
import Footer from "./Footer";
import DefaultQuestionsChips from "../../../../(components)/DefaultQuestionsChips";
import { useEffect, useRef } from "react";
import { useCompactChatbot } from "../../context/CompactContext";
import { useWidget } from "../../../../context/WidgetContext";
import { ScrollDiv } from "../../../../(components)/styles";
// import ChatItem from "../../../../(components)/ChatItem";
// import Chatform from "../../../../(components)/ChatForm";
// import { StorageManager } from "../../../../utils/storage";
import { useChatbot } from "../../../../context/ChatbotContext";
import { HIDE_HEADER, getTranslatedText } from "../../../../utils/helper";
import { onMessagePayloadD } from "../../../../types/message";
import { useLanguage } from "../../../../context/LanguageProvider";
import ChatItem2 from "../../../../(components)/ChatItem2";
import LoadingDots from "../../../../(components)/MessageLoaders/LoadingDots";
import FollowUpQuestions from "../../../../(components)/FollowUpQuestions";
import styled from "styled-components";
import ErrorBar from "../../../../(components)/ErrorBar";

export default function Chatbot() {
  const { messages, onMessageSend, sessionData, loadingStatus, creatingSession } = useCompactChatbot();
  const { isFullPage, followUpQuestions, setFollowUpQuestions } = useChatbot();

  const { layout } = useWidget();
  const { locale, defaultLocale } = useLanguage();

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  // const [userScrolledUp, setUserScrolledUp] = useState(false);

  const followUpQuestionsList = sessionData ? (followUpQuestions[sessionData?.session_uid]?.length > 0 ? followUpQuestions[sessionData?.session_uid] : []) : [];

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loadingStatus]);

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 400);
  }, [followUpQuestionsList.length]);

  const handleScroll = () => {
    // Check if the user has scrolled up manually
    if (chatContainerRef.current) {
      // setUserScrolledUp(chatContainerRef.current.scrollTop + chatContainerRef.current.clientHeight < chatContainerRef.current.scrollHeight);
    }
  };

  const onMessage = (message: onMessagePayloadD) => {
    if (message.content_type === "text") {
      if (!message.message) return;

      setFollowUpQuestions({});

      // if (leadTempMessage) {
      //   return;
      // }

      // if (leadPending) {
      //   setLeadTempMessage(message.message);
      //   return;
      // }
      onMessageSend(message);
    } else {
      onMessageSend(message);
    }
  };

  return (
    <div className="compactWidgetWrapper">
      {/* <OverlayLoader /> */}
      {HIDE_HEADER && isFullPage ? null : <Header />}
      <ScrollDiv className="scrollDiv" style={{ transition: `scroll-behavior 0.5s ease-in-out` }} ref={chatContainerRef} onScroll={handleScroll}>
        {getTranslatedText({ defaultLocale, locale, text: layout?.welcomeMessage }) && (
          <ChatItem2
            onMessage={() => {}}
            message={{
              createdAt: null,
              message: getTranslatedText({ defaultLocale, locale, text: layout?.welcomeMessage }),
              send_by: "assistant",
              localId: "welcome",
            }}
          />
        )}

        {/* MESSAGE LIST  */}
        {messages
          .filter((i) => i)
          .map((i, ind) => {
            return (
              <ChatItem2
                prevMessage={messages[ind - 1]}
                nextMessage={messages[ind + 1]}
                onMessage={(str: string) => {
                  onMessage({
                    content_type: "text",
                    message: str,
                  });
                }}
                key={i?.localId || i?.message_id || i?.id}
                message={i}
              />
            );
          })}

        {loadingStatus === "loading" && (
          <ChatItem2
            message={{
              send_by: "assistant",
              createdAt: null,
              localId: "loader",
            }}
            loading
          />
        )}

        {/* {leadTempMessage && (
          <>
            <ChatItem
              message={{
                createdAt: null,
                message: leadTempMessage,
                send_by: "user",
                localId: "leadTempMessage",
              }}
            />
            <div style={{ marginTop: "8px", paddingInline: "8px" }}>
              <Chatform onResize={() => {}} onSubmit={onLeadSubmit} sessionDetail={sessionData} />
            </div>
          </>
        )} */}

        {loadingStatus !== "loading" && (
          <>
            {followUpQuestionsList.length > 0 ? (
              <FollowUpQ>
                <FollowUpQuestions
                  onSend={(str) => {
                    onMessage({
                      message: str,
                      content_type: "text",
                    });
                  }}
                  sesssionUid={sessionData?.session_uid}
                />
              </FollowUpQ>
            ) : (
              <>
                {messages.length === 0 && (
                  <div style={{ marginTop: "auto", width: "100%" }} className={padX}>
                    <DefaultQuestionsChips
                      onSend={(str) => {
                        onMessage({
                          message: str,
                          content_type: "text",
                        });
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
        {/* {loadingStatus && <>{loadingStatus === "loading" && <span>Loading.....</span>}</>} */}
      </ScrollDiv>
      <ErrorBar />
      {creatingSession ? (
        <div style={{ padding: "20px" }}>
          <LoadingDots />
        </div>
      ) : (
        <Footer onSend={onMessage} />
      )}
    </div>
  );
}

export const padX = "ygpt-px-2";

const FollowUpQ = styled.div`
  margin-bottom: -8px;
  width: 100%;
  position: sticky;
  bottom: -8px;
  margin-top: auto;
`;

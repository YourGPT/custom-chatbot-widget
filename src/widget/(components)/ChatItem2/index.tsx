import styled from "styled-components";
import ChatbotLogo from "../logos/Chatbot";
import { useWidget } from "../../context/WidgetContext";
import Carousel from "./elements/Carousel";
import Card from "./elements/Card";
import MDText from "../ChatItem/MDText";
import TimeText from "../TimeText";
import { HIDE_LEARN_MORE } from "../../utils/helper";
import { useChatbot } from "../../context/ChatbotContext";
import LearnMoreLinks from "../ChatItem/LearnMoreLinks";
import { AnimatePresence, motion } from "framer-motion";
import ImageModal from "../ImageModal";
import { useState } from "react";
import clsx from "clsx";
import LoadingDots from "../MessageLoaders/LoadingDots";
import AudioMessage from "./elements/Audio";
// import VoiceAnimationIcon from "../icons/VoiceAnimationIcon";
// import { textToSpeechApi } from "../../network/api";
// import { ApiRes } from "../../types/enum";
// import { MessageActionBtnValuesD } from "../../types/message";

// const NON_FLOW_BTN_VALUES: MessageActionBtnValuesD[] = ["dislike", "like", "requesthumanoperator", "Re-enable AI"];

export default function ChatItem2({ message, loading, onMessage, prevMessage }: { message: any; onMessage?: any; nextMessage?: any; prevMessage?: any; loading?: boolean }) {
  const [imageModal, setImageModal] = useState("");
  const { setting } = useWidget();
  const { layout } = useWidget();
  const { isFullPage } = useChatbot();
  // const audioRef = useRef<HTMLAudioElement | null>(null);

  const renderExtra = () => {
    if (!message) return null;
    switch (message.content_type) {
      case "carousel":
        return (
          <Carousel
            actionType={message.targets.actionType}
            cards={message.targets.cards}
            onAction={(txt) => {
              onMessage(txt);
            }}
          />
        );
      case "card":
        return (
          <div className="padX">
            <Card
              title={message?.targets?.title}
              desc={message?.targets?.description}
              imageUrl={message.targets?.imageUrl}
              buttons={message.targets?.buttons || []}
              onAction={(text) => {
                onMessage(text);
              }}
              actionType={message?.targets?.actionType}
            />
          </div>
        );
      case "image":
        return (
          <div className="imageMessage padX">
            <motion.img
              onClick={() => {
                setImageModal(message.url || "");
              }}
              src={message.url || ""}
              className=""
            />
            <AnimatePresence>
              {imageModal && (
                <ImageModal
                  // layoutId={renderMessage.url || ""}
                  src={imageModal}
                  onClose={() => {
                    setImageModal("");
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        );
      case "audio":
        return <AudioMessage src={message.url || ""} />;
      // return <audio controls src={message.url || ""} />;

      default:
        null;
    }
  };

  // const onChoice = (action: any) => {
  //   if (action && onMessageActionBtn && message.id && message.choices) {
  //     // if (NON_FLOW_BTN_VALUES.includes(action.value) && action.selected) {
  //     //   return;
  //     // }

  //     onMessageActionBtn({
  //       messageId: message.id,
  //       action: message.choices?.map((i: any) => {
  //         if (i.value === action.value) {
  //           return { ...i, selected: true };
  //         } else {
  //           return { ...i, selected: false };
  //         }
  //       }),
  //     });
  //   }
  // };

  const extraContent = renderExtra();

  const messageDate = new Date(message?.createdAt || undefined);
  const prevMessageDate = new Date(prevMessage?.createdAt || undefined);

  // Calculate the difference in minutes
  const diffInMinutes = (messageDate.getTime() - prevMessageDate.getTime()) / 60000;

  // check if consecutive message send_by in message and prevMessage is same
  const isFirst = prevMessage?.send_by !== message?.send_by || diffInMinutes > 1;

  const isConsecutive = isFirst || prevMessage?.send_by === message?.send_by;

  // Text to speech
  // const [isSpeaking, setIsSpeaking] = useState(false);
  // const [ttsLoading, setTtsLoading] = useState(false);
  // const [prevAudio, setPrevAudio] = useState("");

  // const onSpeak = async () => {
  //   if (prevAudio) {
  //     const audio = new Audio(prevAudio);
  //     audioRef.current = audio;
  //     audio.onplay = () => setIsSpeaking(true);
  //     audio.onended = () => setIsSpeaking(false);
  //     audio.play();
  //     return;
  //   }
  //   try {
  //     setTtsLoading(true);
  //     const res = await textToSpeechApi({ widget_uid: widgetUid, session_uid: activeSession?.session_uid, message_id: message.id });
  //     if (res?.type === ApiRes.SUCCESS) {
  //       setPrevAudio(res.data.url);
  //       const audio = new Audio(res.data.url);
  //       audioRef.current = audio;
  //       audio.onplay = () => setIsSpeaking(true);
  //       audio.onended = () => setIsSpeaking(false);
  //       audio.play();
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setTtsLoading(false);
  //   }
  // };

  // const stopSpeaking = () => {
  //   setIsSpeaking(false);
  //   audioRef.current?.pause();
  // };

  if (!message) return null;

  if (!message.message && message.loadingStatus !== "loading" && message.stream && !message.url) {
    return null;
  }

  // const { onMessageSend, leadTempMessage, leadPending, setLeadTempMessage } = useCompactChatbot();
  // const { setFollowUpQuestions } = useChatbot();

  // const onMessagee = (message: onMessagePayloadD) => {
  //   if (message.content_type === "text") {
  //     if (!message.message) return;

  //     setFollowUpQuestions({});

  //     if (leadTempMessage) {
  //       return;
  //     }

  //     if (leadPending) {
  //       setLeadTempMessage(message.message);
  //       return;
  //     }
  //     onMessageSend(message);
  //   } else {
  //     onMessageSend(message);
  //   }
  // };

  return (
    <Root
      className={clsx({
        sent: message?.send_by === "user",
        consecutive: isConsecutive,
        isFirst: isFirst,
      })}
    >
      {isFirst && (
        <Header className="padX">
          {message?.send_by === "assistant" || message?.send_by === "operator" ? (
            <>
              <div className="logoBox">
                {message.operator?.profile_pic ? (
                  <img src={message.operator?.profile_pic} />
                ) : setting?.logo ? (
                  <img src={setting.logo} />
                ) : (
                  <div className="logo">
                    <ChatbotLogo size={20} />
                  </div>
                )}
              </div>
              <div className="text">{message?.operator?.first_name || (setting?.name && setting.name)}</div>
            </>
          ) : (
            <></>
          )}
          {message.createdAt && (
            <div className="time">
              <TimeText time={message?.createdAt} />
            </div>
          )}
        </Header>
      )}

      {(message.message || message.loadingStatus || loading) && message.content_type !== "audio" ? (
        <div className="boxOuter2">
          <div className={`padX boxOuter`}>
            <div className={`box`}>
              {message.message && <MDText text={message.message} />}

              {(message.loadingStatus === "loading" || loading) && !message.message && <LoadingDots />}
            </div>

            {/* {message?.id && message?.send_by === "assistant" && message.loadingStatus !== "loading" && !loading && message.message && setting?.voice?.text_to_speech && (
              <VoiceBtn speaking={isSpeaking || ttsLoading ? "1" : "0"} onClick={isSpeaking ? stopSpeaking : onSpeak}>
                {ttsLoading ? (
                  <div style={{ marginInline: "8px" }}>
                    <SmallLoadingDots />
                  </div>
                ) : isSpeaking ? (
                  <div style={{ marginInline: "8px" }}>
                    <VoiceAnimationIcon size={16} />
                  </div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height={14} width={14}>
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                    <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
                  </svg>
                )}
              </VoiceBtn>
            )} */}
          </div>
        </div>
      ) : null}

      {extraContent ? <div className="extra">{extraContent}</div> : null}

      {message.id && message.choices?.length > 0 ? (
        <div className="actionBtns padX">
          {message.choices?.map((i: any) => {
            const isDisabled = i.selected;
            if (message.response_source !== "studio_response") return null;
            return (
              <button
                key={i.value}
                className={`actionBtn ${i.selected || isDisabled ? "selected" : ""}`}
                onClick={() => {
                  // if (!isDisabled) onChoice(i);
                  onMessage(i.value);
                }}
              >
                <span>{i.icon}</span> {i.text || i.label}{" "}
              </button>
            );
          })}
        </div>
      ) : null}

      {layout?.learnMoreLinks ? (
        <>
          {HIDE_LEARN_MORE && isFullPage
            ? null
            : message.links?.length > 0 && (
                <div className="padX links">
                  <LearnMoreLinks links={message.links || []} />
                </div>
              )}
        </>
      ) : null}
    </Root>
  );
}

// const VoiceBtn = styled.button<{ speaking: "0" | "1" }>`
//   all: unset;

//   /* ygpt-rounded-full ygpt-text-xs ygpt-flex ygpt-items-center ygpt-justify-center ygpt-gap-1 ygpt-cursor-pointer ygpt-text-[hsl(var(--yourgptChatbotPrimaryColorHsl))] */
//   border-radius: 120px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 12px;
//   gap: 4px;
//   cursor: pointer;
//   color: hsl(var(--yourgptChatbotPrimaryColorHsl));

//   transition: all 0.2s ease-in-out;
//   height: 24px;
//   aspect-ratio: 1;
//   position: absolute;
//   top: -6px;
//   right: 2px;
//   z-index: 120;
//   background-color: hsl(var(--yourgptChatbotSurfaceColorHsl));
//   transition: all 0.2s ease-in-out;
//   border: 1px solid var(--yourgptChatbotTextOnPrimaryColor);
//   box-shadow: 0 0 8px 3px hsl(var(--yourgptChatbotPrimaryColorHsl) / 0.2);
//   color: hsl(var(--yourgptChatbotTextColorHsl));

//   &:hover {
//     box-shadow: 0 0 4px 3px hsl(var(--yourgptChatbotPrimaryColorHsl) / 0.2);
//   }
// `;

/* ${({ speaking }) =>
  speaking === "0" &&
  css`
    border: 1px solid hsl(var(--yourgptChatbotPrimaryColorHsl));

    &:hover {
      background: hsl(var(--yourgptChatbotPrimaryColorHsl) / 0.9);
      color: var(--yourgptChatbotTextOnPrimaryColor);
      box-shadow: 0 0 0 3px hsl(var(--yourgptChatbotPrimaryColorHsl) / 0.2);
      transition: all 0.2s ease-in-out;
    }
  `} */

const Root = styled.div`
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  width: 100%;

  &.consecutive {
    margin-bottom: 4px;
  }

  .time {
    opacity: 0.5;
    /* visibility: hidden; */
    transition: all 0.2s;
    font-size: 12px;
    font-weight: 400;
    padding-left: 4px;
  }
  &:hover {
    .time {
      opacity: 0.5;
      visibility: visible;
    }
  }

  .padX {
    padding-left: 12px;
    padding-right: 12px;
  }

  &.sent {
    align-items: flex-end;
    margin-bottom: 4px;

    .extra {
      align-items: flex-end;
    }

    .boxOuter2 {
      align-self: flex-end;
      justify-content: flex-end;
    }
    .box {
      background: var(--yourgptChatbotUserMessageBgColor);
      color: var(--yourgptChatbotUserMessageTextColor);
      border-bottom-right-radius: 4px;
      border-top-left-radius: 12px;
      & * {
        color: var(--yourgptChatbotUserMessageTextColor);
      }
    }
  }

  .boxOuter {
    position: relative;
  }
  .boxOuter2 {
    width: 90%;
    max-width: 560px;
    display: flex;
  }

  .box {
    background: var(--yourgptChatbotBotMessageBgColor);
    border-radius: 12px;
    padding: 8px 12px;
    color: var(--yourgptChatbotBotMessageTextColor);
    font-weight: 400;
    line-height: 22px;
    font-size: 14px;
    border-top-left-radius: 4px;
    display: inline-block;
    min-width: 60px;
    overflow: auto;

    & * {
      color: var(--yourgptChatbotBotMessageTextColor);
    }

    position: relative;

    /* &.cursorBlink {
      &:after {
        position: absolute;
        right: 0px;
        bottom: 0px;
        z-index: 12;
        content: "";
        display: inline-block;
        width: 5px;
        height: 1.2em;
        background-color: currentColor;
        animation: blink 0.8s infinite;
      }
    } */
  }

  .extra {
    margin-bottom: 4px;
    margin-top: 4px;
    display: flex;
    flex-direction: column;
  }

  .actionBtns {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 4px;
    margin-bottom: 4px;
  }

  .actionBtn {
    cursor: pointer;
    border: 1px solid hsl(var(--yourgptChatbotPrimaryColorHsl));
    color: hsl(var(--yourgptChatbotTextColorHsl) / 0.8);
    background-color: var(--yourgptChatbotSurfaceColor);

    border-radius: 110px;
    padding: 5px 10px;
    font-size: 13px;
    outline: none;
    //add ring
    transition: all 0.2s;
    &:hover {
      background: hsl(var(--yourgptChatbotPrimaryColorHsl) / 0.9);
      /* color: hsl(var(--yourgptChatbotPrimaryColorHsl)); */
      color: var(--yourgptChatbotTextOnPrimaryColor);
      box-shadow: 0 0 0 3px hsl(var(--yourgptChatbotPrimaryColorHsl) / 0.2);
    }
    &.disabled {
      opacity: 0.8;
      pointer-events: none;
    }
    &.selected {
      background: hsl(var(--yourgptChatbotPrimaryColorHsl) / 0.9);
      color: var(--yourgptChatbotTextOnPrimaryColor);
    }
  }

  .links {
    margin-top: 12px;
  }

  .imageMessage {
    width: 80%;
    max-width: 400px;
    height: auto;
    overflow: hidden;
    position: relative;
    & > img {
      border-radius: 8px;

      height: 100%;
      width: 100%;
      object-fit: cover;
      cursor: pointer;
    }
  }
`;
const Header = styled.div`
  display: flex;
  gap: 4px;
  font-size: 13px;
  align-items: center;
  font-weight: 500;
  margin-bottom: 4px;

  .text {
    color: hsl(var(--yourgptChatbotTextColorHsl) / 0.8);
  }

  .logoBox {
    .logo {
      height: 32px;
      width: 32px;
      border-radius: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--yourgptChatbotPrimaryColor);
      color: var(--yourgptChatbotTextOnPrimaryColor);
    }
    img {
      height: 32px;
      width: 32px;
      object-fit: contain;
      border-radius: 120px;
      overflow: hidden;
      flex-shrink: 0;
    }
  }
`;

// const SmallLoadingDots = () => {
//   return (
//     <WaveLoader>
//       <span style={{ animationDelay: "0s" }} />
//       <span style={{ animationDelay: "0.2s" }} />
//       <span style={{ animationDelay: "0.4s" }} />
//     </WaveLoader>
//   );
// };

// const waveAnimation = keyframes`
//   0%, 100% {
//     opacity: 1;
//     transform: translateY(6);
//   }
//  65% {
//     opacity: 0.5;
//     transform: translateY(-6px);
//   }
// `;

// const WaveLoader = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 20px;
//   gap: 2px;
//   padding-left: 2px;
//   padding-right: 2px;
//   padding-top: 6px;

//   span {
//     width: 4px;
//     height: 4px;
//     border-radius: 50%;
//     background-color: currentColor;
//     animation: ${waveAnimation} 0.8s ease-in-out infinite;
//   }
// `;

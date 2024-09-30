import ChatbotLogo from "../logos/Chatbot";
import { AnimatePresence, motion } from "framer-motion";
import { useChatbot } from "../../context/ChatbotContext";
import { useWidget } from "../../context/WidgetContext";
import { useEffect, useState } from "react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import styled from "styled-components";
// import { YOUR_GPT_LAYOUT } from "../../utils/constants";
// import { getTranslatedText } from "../../utils/helper";
// import { useLanguage } from "../../context/LanguageProvider";

export default function WidgetButton() {
  const { chatbotPopup, unseenMessageCount, setToSendMessageQueue, setChatbotPopup, unseenMessages, triggerMessages, setTriggerMessages } = useChatbot();
  const { setting } = useWidget();
  const [message, setMessage] = useState("");
  // const [customQuestion, setCustomQuestion] = useState("");
  // const { locale, defaultLocale } = useLanguage();

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (unseenMessages.length > 0) {
      // :TRANSLATE
      [...unseenMessages].pop()?.message && setMessage([...unseenMessages].pop()?.message || "New Message");
    } else {
      setMessage("");
      setShow(false);
    }
  }, [unseenMessages]);

  useEffect(() => {
    let tm: any;
    if (message) {
      setShow(true);
      tm = setTimeout(() => {
        setMessage("");
        setShow(false);
      }, 3000);
    }
    return () => {
      tm && clearTimeout(tm);
    };
  }, [message]);

  const onClose = () => {
    setShow(false);
    setMessage("");
    setTriggerMessages(null);
  };

  const onTriggerQuestionAsk = (question: string) => {
    setToSendMessageQueue((s) => {
      return [...s, question];
    });
    onClose();
  };

  const unCounts = unseenMessageCount > 0 ? unseenMessageCount + unseenMessages.length : unseenMessages.length > 0 ? unseenMessages.length : 0;

  const showRing = unCounts > 0 || show;

  const hasTrigger = (triggerMessages?.messages?.length! > 0 || triggerMessages?.questions?.length! > 0) && !chatbotPopup;

  const haveToShow = hasTrigger || message;

  return (
    <AnimatePresence>
      <div className="ygpts-widgetBtnOuter">
        <AnimatePresence>
          {haveToShow && (
            <MessagesOuter
              transition={{
                duration: 0.4,
                ease: [0.65, 0, 0.35, 1],
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="closeBtn" onClick={onClose}>
                <XMarkIcon />
              </div>
              {message ? (
                <>
                  <div className="messages">
                    <div className="message">{message}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="messages">
                    {triggerMessages?.messages?.map((i) => {
                      return <div className="message">{i}</div>;
                    })}
                    {triggerMessages?.questions?.map((i) => {
                      return (
                        <div
                          className="btn"
                          onClick={() => {
                            onTriggerQuestionAsk(i);
                          }}
                        >
                          {i}
                          <PaperAirplaneIcon className="sendIcon" />
                        </div>
                      );
                    })}
                    {/* 
                    {false && (
                      <CustomInput>
                        <input
                          value={customQuestion}
                          onChange={(e) => setCustomQuestion(e.target.value)}
                          placeholder={getTranslatedText({ defaultLocale, locale, text: layout?.chatbotActionBarSettings?.placeholderText }) || YOUR_GPT_LAYOUT.chatbotActionBarSettings?.placeholderText?.en}
                        />
                      </CustomInput>
                    )} */}
                  </div>
                </>
              )}

              {/* <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>🔔 New message </div> */}
            </MessagesOuter>
          )}
        </AnimatePresence>
        <div style={{ position: "relative" }} className="widgetBtnMiddle">
          <BtnRing style={{ visibility: showRing ? "visible" : "unset" }}>
            <RoundBtn style={{ background: "var(--yourgptChatbotPrimaryColor)", color: "var(--yourgptChatbotTextOnPrimaryColor)" }} onClick={() => setChatbotPopup((s) => !s)} className="ygpts-widgetBtn">
              {unCounts > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ borderRadius: 120, height: 22, width: 22, bottom: "calc(100% - 10px)", right: 0, fontSize: 12 }} layoutId="unseenCounter" className="unseenCounter">
                  {unCounts > 9 ? "9+" : unCounts}
                </motion.div>
              )}
              {/* UNSEEN COUNTER  */}

              {chatbotPopup ? (
                <motion.div key={1} exit={{ opacity: 0, rotate: 20 }} initial={{ opacity: 0, rotate: 20 }} animate={{ opacity: 1, rotate: 0 }}>
                  <ChevronDownIcon className="chev" />
                </motion.div>
              ) : (
                <motion.div key={2} exit={{ opacity: 0, scale: 0.2, rotate: 60 }} initial={{ opacity: 0, scale: 0.2, rotate: 60 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}>
                  {setting?.logo ? <img src={setting.logo} /> : <ChatbotLogo size={"unset"} />}
                </motion.div>
              )}
            </RoundBtn>
          </BtnRing>
        </div>
      </div>
    </AnimatePresence>
  );
}

const BtnRing = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  &:before {
    content: "";
    position: absolute;
    top: -4px; /* Adjust these values based on the border width to align perfectly */
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: inherit;
    border: 2px solid transparent;
  }
  &.visible:before {
    border-color: hsl(var(--yourgptChatbotOrange));
  }
`;

const RoundBtn = styled.div`
  position: relative;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  /* &.unread { */

  /* } */

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.88);
  }
  & > span {
    position: absolute;
  }
  .chev {
    width: 20px;
    height: 20px;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const MessagesOuter = styled(motion.div)`
  /* color: var(--yourgptChatbotTextColor); */
  margin-bottom: 12px;
  max-width: 420px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .closeBtn {
    padding: 8px 2px;
    padding-bottom: 6px;
    color: rgba(0, 0, 0, 0.5);
    transition: all 0.2s;

    svg {
      cursor: pointer;
      width: 22px;
      height: 22px;
    }

    &:hover {
      transform: scale(1.1);
      color: rgba(0, 0, 0, 0.9);
    }
  }

  .messages {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    font-size: 15px;
  }
  .message {
    /* max-width: 300px; */
    padding: 14px 12px;
    background: #fff;
    box-shadow: 1px 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    line-height: normal;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.7);
  }

  .btn {
    padding: 10px 12px;
    /* background: hsl(var(--yourgptChatbotPrimaryColorHsl) / 0.12);
    color: hsl(var(--yourgptChatbotPrimaryColorHsl)); */
    font-size: 14px;

    background: #fff;
    /* color: rgba(0, 0, 0, 0.7); */
    color: hsl(var(--yourgptChatbotPrimaryColorHsl));
    border: 1px solid hsl(var(--yourgptChatbotPrimaryColorHsl) / 0.6);
    box-shadow: 1px 2px 12px hsl(var(--yourgptChatbotPrimaryColorHsl) / 0.09);
    cursor: pointer;
    border-radius: 8px;
    font-size: 15px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
    &:hover {
      background: hsl(var(--yourgptChatbotPrimaryColorHsl));
      color: hsl(var(--yourgptChatbotTextOnPrimaryColorHsl));

      .sendIcon {
        max-width: 20px;
      }
    }
  }

  .sendIcon {
    width: 18px;
    max-width: 0px;
    height: 18px;
    margin-top: -2px;
    transition: all 0.2s;
    color: hsl(var(--yourgptChatbotTextOnPrimaryColorHsl));
    transform: rotate(-45deg);
  }
`;

// const CustomInput = styled.div`
//   background: #fff;
//   box-shadow: 1px 2px 8px rgba(0, 0, 0, 0.12);
//   margin-top: 12px;
//   border: 1px solid rgba(0, 0, 0, 0.1);
//   font-size: 14px;

//   width: 100%;
//   display: flex;
//   border-radius: 8px;
//   overflow: hidden;

//   input {
//     flex: 1;
//     padding: 16px 12px;
//     outline: none;
//     color: rgba(0, 0, 0, 0.8);

//     &::placeholder {
//       color: rgba(0, 0, 0, 0.4);
//     }
//   }
// `;

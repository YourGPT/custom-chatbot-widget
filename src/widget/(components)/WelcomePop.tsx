import { AnimatePresence, motion } from "framer-motion";
import { useWidget } from "../context/WidgetContext";
import { useChatbot } from "../context/ChatbotContext";
import { useEffect, useState } from "react";
import MDText from "./ChatItem/MDText";
import styled from "styled-components";
import { useLanguage } from "../context/LanguageProvider";
import { XCircleIcon } from "@heroicons/react/20/solid";

const animVar = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

export default function WelcomePop() {
  const { layout } = useWidget();
  const { interacted, onWelcomePopupClick, widgetPlace, chatbotPopup, triggerMessages } = useChatbot();
  const { defaultLocale, locale } = useLanguage();
  const [show, setShow] = useState(false);
  const [showFromSdk, setShowFromSdk] = useState(false);

  useEffect(() => {
    if (triggerMessages) {
      setShow(false);
    }
  }, [triggerMessages]);

  useEffect(() => {
    if (widgetPlace == "showcase" && !chatbotPopup && !triggerMessages) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [widgetPlace, chatbotPopup, triggerMessages]);

  useEffect(() => {
    if (widgetPlace === "showcase") return;
    let tm: any;
    if (triggerMessages) return;

    if (!interacted) {
      tm = setTimeout(() => {
        if (!triggerMessages) setShow(true);
      }, 2000);
    } else {
      setShow(false);
    }

    return () => {
      tm && clearTimeout(tm);
    };
  }, [interacted, widgetPlace, triggerMessages]);

  useEffect(() => {
    window.$yourgptChatbot.openWelcomeMessage = () => {
      setShowFromSdk(true);
      setShow(true);
    };
    window.$yourgptChatbot.closeWelcomeMessage = () => {
      setShowFromSdk(false);
      setShow(false);
    };
  }, []);

  let messages: string[] = [];

  if (layout?.welcomePopup?.text) {
    const texts = layout?.welcomePopup?.text[locale || defaultLocale];

    if (texts && texts.length > 0) {
      messages = texts;
    }
  }

  if (messages.length === 0) return null;

  return (
    <AnimatePresence>
      {(show || showFromSdk) && (
        <motion.div
          variants={animVar}
          transition={{
            staggerChildren: 0.2,
            type: "spring",
          }}
          initial="hidden"
          animate="visible"
          className="ygpts-welcomePopup"
        >
          <Boxes>
            {messages.map((i) => {
              return (
                <Box
                  variants={animVar}
                  key={i}
                  onClick={() => {
                    onWelcomePopupClick();
                  }}
                >
                  <Text>
                    <MDText raw text={i} />
                  </Text>

                  <CloseBtn
                    onClick={(e) => {
                      onWelcomePopupClick(false);
                      e.stopPropagation();
                    }}
                    className="closeBtn"
                  >
                    <XCircleIcon height={24} />
                  </CloseBtn>
                </Box>
              );
            })}
          </Boxes>
        </motion.div>
      )}
      ;
    </AnimatePresence>
  );
}

const Text = styled.div`
  font-size: 14px;
  line-height: 20px;
  img {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    margin: 12px auto;
  }
  & p {
    /* font-size: 15px; */
  }
`;

const Boxes = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const Box = styled(motion.div)`
  background-color: var(--yourgptChatbotSurfaceColor);
  padding: 10px 16px;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: rgba(0, 0, 0, 0.06) 0px 3px 6px;
  cursor: pointer;
  max-width: 320px;
  &:hover {
    box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
    .closeBtn {
      opacity: 1;
    }
  }
  position: relative;
`;

const CloseBtn = styled.div`
  position: absolute;
  right: -12px;
  top: -12px;
  height: 32px;
  aspect-ratio: 1/1;
  width: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  opacity: 0;
  color: hsl(var(--yourgptChatbotTextColorHsl) / 0.2);
  &:hover {
    color: hsl(var(--yourgptChatbotTextColorHsl) / 0.8);
  }
`;
// const Box = styled.div`
//   background-color: var(--yourgptChatbotSurfaceColor);
//   padding: 16px;
//   border-radius: 16px;
//   border: 2px solid hsl(var(--yourgptChatbotPrimaryColorHsl) / 0.4);
//   box-shadow: hsl(var(--yourgptChatbotPrimaryColorHsl) / 0.2) 0px 3px 12px;
//   max-width: 320px;
// `;

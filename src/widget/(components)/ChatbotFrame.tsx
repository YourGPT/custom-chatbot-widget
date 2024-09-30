import { motion } from "framer-motion";
import React from "react";
import styled from "styled-components";
import { useChatbot } from "../context/ChatbotContext";
import { useWidget } from "../context/WidgetContext";

const frameVariants = {
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  hide: {
    opacity: 0,
    scale: 0.7,
    y: 10,
  },
  exit: {
    opacity: 0,
    scale: 0.7,
    y: 10,
  },
};

export default function ChatbotFrame({ children }: { children: React.ReactNode }) {
  const { chatbotPopup, expanded } = useChatbot();
  const { layout } = useWidget();

  return (
    <>
      {/* <AnimatePresence> */}
      <Root
        className={` ygpts-frame ${chatbotPopup ? "show" : ""} ${expanded ? "big" : ""} ${chatbotPopup ? "show" : "hide"}`}
        variants={frameVariants}
        initial="hide"
        animate={chatbotPopup ? "show" : "hide"}
        exit="hide"
        transition={{
          duration: 0.4,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          transformOrigin: layout?.position.align === "left" ? "left bottom" : "right bottom",
        }}
      >
        <motion.div className="frame">{children}</motion.div>
      </Root>
      {/* </AnimatePresence> */}
    </>
  );
}

const Root = styled(motion.div)`
  .frame {
    position: relative;
    height: 100%;
  }

  &.show {
    pointer-events: all;
  }
  &.hide {
    pointer-events: none;
  }
`;

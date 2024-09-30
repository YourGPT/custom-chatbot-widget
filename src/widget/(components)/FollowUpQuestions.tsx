import styled from "styled-components";
import { useChatbot } from "../context/ChatbotContext";
import { motion } from "framer-motion";

const slideIn = {
  hide: {
    x: 4,
    opacity: 0,
  },
  show: {
    x: 0,
    opacity: 1,
  },
};

export default function FollowUpQuestions({ sesssionUid, onSend }: { sesssionUid?: string; onSend: (str: string) => any }) {
  const { followUpQuestions, setFollowUpQuestions } = useChatbot();
  const list = sesssionUid ? followUpQuestions[sesssionUid] || [] : [];

  if (list.length === 0) return null;

  return (
    <Root
      variants={{
        hide: {
          opacity: 0,
          height: 0,
        },
        show: {
          opacity: 1,
          height: "auto",
        },
      }}
      initial="hide"
      animate="show"
      transition={{
        duration: 0.2,
        staggerChildren: 0.2,
      }}
    >
      <Slider>
        <List>
          {list
            .filter((i) => i)
            .map((i) => {
              return (
                <motion.button
                  className="btn"
                  key={i}
                  variants={slideIn}
                  onClick={() => {
                    onSend(i);
                    if (sesssionUid) {
                      setFollowUpQuestions((s) => ({ ...s, [sesssionUid]: [] }));
                    }
                  }}
                >
                  {i}
                </motion.button>
              );
            })}
          <div style={{ width: 20, height: 1, display: "block" }}></div>
        </List>
      </Slider>
    </Root>
  );
}

const Root = styled(motion.div)`
  flex-wrap: nowrap;
  width: 100%;
  overflow: hidden;
`;

const Slider = styled.div`
  width: 100%;
  overflow-x: auto;
  &::-webkit-scrollbar {
    background: hsl(var(--yourgptChatbotTextColorHsl) / 0.12);
    height: 12px;
  }
  &::-webkit-scrollbar-track {
  }
  &::-webkit-scrollbar-thumb {
    background: hsl(var(--yourgptChatbotTextColorHsl) / 0.4);
    border-radius: 10px;
  }
`;

const List = styled(motion.div)`
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
  white-space: nowrap;
  padding: 4px 8px;

  button {
    all: unset;
    cursor: pointer;
    background: var(--yourgptChatbotPrimaryColor);
    color: var(--yourgptChatbotTextOnPrimaryColor);
    padding: 8px 12px;
    border-radius: 120px;
    font-size: 14px;
    transition: all 0.2s;
    &:hover {
      background: hsl(var(--yourgptChatbotPrimaryColorHsl) / 0.9);
    }
  }
`;

import { RenderMessageItem } from "../../types/message";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import MDText from "./MDText";
import { CursorBlink } from "../styles";
import { useMemo, useState } from "react";
import ImageModal from "../ImageModal";
import LoadingDots from "../MessageLoaders/LoadingDots";
import styled from "styled-components";

export default function MessageBox({ renderMessage, loading = false }: { renderMessage: RenderMessageItem; loading?: boolean }) {
  const [modalImage, setModalImage] = useState("");

  const renderContent = useMemo(() => {
    switch (renderMessage.content_type) {
      case "image":
        return (
          <LayoutGroup>
            <div className="image">
              <motion.img
                onClick={() => {
                  setModalImage(renderMessage.url || "");
                }}
                layoutId={renderMessage.url || ""}
                src={renderMessage.url || ""}
                className="imgUrl"
              />
              <AnimatePresence>
                {modalImage && (
                  <ImageModal
                    layoutId={renderMessage.url || ""}
                    src={modalImage}
                    onClose={() => {
                      setModalImage("");
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          </LayoutGroup>
        );
      case "text":
      case "picker":
        return (
          <>
            <div className="picker">
              {renderMessage.text && <MDText text={renderMessage.text} />} {renderMessage.loadingStatus === "streaming" && !renderMessage.text && <CursorBlink />}
            </div>
          </>
        );
    }
  }, [renderMessage, modalImage]);

  return (
    <Root
      initial={{
        x: 10,
        opacity: 0,
      }}
      animate={{
        x: 0,
        opacity: 1,
      }}
      className={`${renderMessage.sent ? "sent" : "not-sent"} `}
      style={{
        background: renderMessage.sent ? "var(--yourgptChatbotUserMessageBgColor)" : "var(--yourgptChatbotBotMessageBgColor)",
        color: renderMessage.sent ? "var(--yourgptChatbotUserMessageTextColor)" : "var(--yourgptChatbotBotMessageTextColor)",
      }}
    >
      {loading ? (
        <div>
          <LoadingDots />
        </div>
      ) : (
        renderContent
      )}
    </Root>
  );
}

const Root = styled(motion.div)`
  border-radius: 8px;
  padding: 8px 12px;

  &.sent {
    /* ygpt-rounded-tr-none */
    border-radius: 8px 8px 0 8px;
  }
  &.not-sent {
    /* ygpt-rounded-tl-none */
    border-radius: 8px 8px 8px 0;
  }

  .image {
    /* ygpt-max-w-[100%] ygpt-w-[220px] */
    max-width: 100%;
    width: 220px;

    .imgUrl {
      /* ygpt-h-auto ygpt-w-full */
      height: auto;
      width: 100%;
    }
  }

  .picker {
    overflow-wrap: break-word;
    font-size: 14px;
  }
`;

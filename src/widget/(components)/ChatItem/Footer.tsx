import styled from "styled-components";
import LearnMoreLinks from "./LearnMoreLinks";
import { useChatbot } from "../../context/ChatbotContext";
import { MessageActionBtnItemD, RenderMessageItem, onMessageActionBtnPayloadD } from "../../types/message";
import { HIDE_LEARN_MORE } from "../../utils/helper";
import { useWidget } from "../../context/WidgetContext";
export default function Footer({ message, onMessageActionBtn }: { message: RenderMessageItem; onMessageActionBtn?: (data: onMessageActionBtnPayloadD) => any }) {
  const { isFullPage } = useChatbot();
  const { layout } = useWidget();

  const choices: MessageActionBtnItemD[] = message.choices || [];

  const message_id = message.id;
  const links = message.links || [];

  const onActionBtn = (action: MessageActionBtnItemD) => {
    if (action && onMessageActionBtn && message_id && choices) {
      onMessageActionBtn({
        messageId: message_id,
        action: choices.map((i) => {
          if (i.value === action.value) {
            return { ...i, selected: true };
          }
          return { ...i, selected: false };
        }),
      });
    }
  };

  if (message.sendBy !== "assistant") {
    return null;
  }

  return (
    <Root>
      {message.loadingStatus !== "loading" && message.loadingStatus !== "streaming" && message_id && message_id !== 0 && message.choices !== undefined && choices && choices.length > 0 ? (
        <Btns className={`${choices.some((i) => i.selected) ? "disabled" : ""}`}>
          {choices.map((i, ind) => {
            return (
              <Btn
                className={`${i.selected ? "selected" : ""}`}
                key={ind}
                onClick={() => {
                  onActionBtn(i);
                }}
              >
                <span>{i.icon}</span> {i.text || i.label}{" "}
              </Btn>
            );
          })}
        </Btns>
      ) : null}

      {layout?.learnMoreLinks ? (
        <>
          {HIDE_LEARN_MORE && isFullPage
            ? null
            : links.length > 0 && (
                <div className="">
                  <LearnMoreLinks links={links} />
                </div>
              )}
        </>
      ) : null}
    </Root>
  );
}

const Root = styled.div`
  margin-top: 6px;
`;

const Btn = styled.button`
  all: unset;
  font-size: 14px;
  color: var(--yourgptChatbotPrimaryColor);
  border: 1px solid;
  border-color: var(--yourgptChatbotPrimaryColor);
  border-radius: 120px;
  padding: 4px 8px;
  transition: all 0.2s;

  &.selected {
    background: var(--yourgptChatbotPrimaryColor);
    color: var(--yourgptChatbotTextOnPrimaryColor);
  }

  &:hover {
    background: var(--yourgptChatbotPrimaryColor);
    color: var(--yourgptChatbotTextOnPrimaryColor);
  }
`;
const Btns = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-bottom: 6px;

  &.disabled {
    pointer-events: none;

    button {
      &.selected {
        opacity: 1;
      }
      opacity: 0.5;
    }
  }
`;

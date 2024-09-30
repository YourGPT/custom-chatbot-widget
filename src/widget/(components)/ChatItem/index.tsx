import Header from "./Header";
import Footer from "./Footer";
import { MessageD, onMessageActionBtnPayloadD } from "../../types/message";
import TimeText from "../TimeText";
import { getRenderMessageItem } from "../../utils/helper";
import MessageBox from "./MessageBox";
import styled from "styled-components";

export default function ChatItem({ onMessageActionBtn, message, loading = false }: { message: MessageD; onMessageActionBtn?: (data: onMessageActionBtnPayloadD) => any; loading?: boolean }) {
  const renderMessage = getRenderMessageItem(message);

  return (
    <Root className={`padX  ${renderMessage.sent ? "messageSent" : "notSent"}`}>
      <div className="messageHeader">
        <Header message={renderMessage} />
      </div>

      <MessageBox
        loading={loading}
        {...{
          renderMessage,
        }}
      />

      {!loading && (
        <>
          <div className={`loading ${renderMessage.sent ? "messageSent" : "notSent"}`}>
            {renderMessage.createdAt && (
              <span style={{ fontSize: 10 }}>
                <TimeText time={renderMessage.createdAt} />
              </span>
            )}
          </div>
          <Footer onMessageActionBtn={onMessageActionBtn} message={renderMessage} />
        </>
      )}
    </Root>
  );
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  width: 90%;

  &.messageSent {
    align-self: flex-end;
    align-items: flex-end;
  }
  &.notSent {
    /* ygpt-self-start ygpt-items-start ygpt-mb-3 */
    align-self: flex-start;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .loading {
    &.messageSent {
      text-align: right;
    }

    &.notSent {
      text-align: left;
    }
  }
`;

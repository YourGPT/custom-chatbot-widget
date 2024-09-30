import { BiSolidUserCircle } from "react-icons/bi";
import { useWidget } from "../../context/WidgetContext";
import { RenderMessageItem } from "../../types/message";
import ChatbotLogo from "../logos/Chatbot";
import styled from "styled-components";

export default function Header({ message }: { message: RenderMessageItem }) {
  const { setting } = useWidget();
  const renderHead = () => {
    switch (message.sendBy) {
      case "user":
        return <div className="user">You</div>;
      case "assistant":
        return (
          <div className="assistant">
            <div className="assistant_logo_wrapper" style={{ background: setting?.logo ? "transparent" : "var(--yourgptChatbotPrimaryColor)", color: "var(--yourgptChatbotTextOnPrimaryColor)" }}>
              {setting?.logo ? <img src={setting.logo} className="assistant_logo" /> : <ChatbotLogo size={20} />}
            </div>
            {setting?.name && <div className="assistant_name">{setting?.name}</div>}
          </div>
        );
      case "operator":
        return (
          <div className="operator">
            <div className="operator_pic_wrapper">{message.user?.pic ? <img src={message.user.pic} className="operator_pic" /> : <BiSolidUserCircle size={24} />}</div>
            <div className="operator_name">
              <div className="">{message.user?.name || message.user?.fName || ""}</div>
              {/* <div className="y ygpt-text-xs ygpt-text-zinc-600">Operator</div> */}
            </div>
          </div>
        );
      default:
        return <></>;
    }
  };

  return <Root>{renderHead()}</Root>;
}

const Root = styled.div`
  color: hsl(var(--yourgptChatbotTextColorHsl) / 0.5);
  margin-bottom: 6px;

  .user {
    /* ygpt-text-xs ygpt-font-medium ygpt-text-right */
    font-size: 12px;
    font-weight: 500;
    text-align: right;
  }

  .assistant {
    /* ygpt-flex ygpt-gap-2 ygpt-items-center */
    display: flex;
    gap: 8px;
    align-items: center;

    .assistant_logo_wrapper {
      /* ygpt-rounded-full ygpt-h-[30px] ygpt-flex ygpt-items-center ygpt-justify-center ygpt-aspect-square */
      border-radius: 50%;
      overflow: hidden;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 1;
      flex-shrink: 0;
    }

    .assistant_logo {
      /* ygpt-h-full ygpt-w-full ygpt-object-cover */
      height: 100%;
      width: 100%;
      object-fit: cover;
    }

    .assistant_name {
      /* ygpt-rounded-md ygpt-text-xs  */
      border-radius: 6px;
      font-size: 12px;
    }
  }

  .operator {
    /* ygpt-flex ygpt-gap-1 ygpt-items-center  */
    display: flex;
    gap: 4px;
    align-items: center;

    .operator_pic_wrapper {
      /* ygpt-h-[30px] ygpt-aspect-square ygpt-items-center ygpt-flex ygpt-justify-center ygpt-bg-gray-200 ygpt-rounded-full ygpt-overflow-hidden */
      height: 30px;
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f3f4f6;
      border-radius: 50%;
      overflow: hidden;
    }

    .operator_pic {
      /* ygpt-h-full ygpt-w-full ygpt-object-cover */
      height: 100%;
      width: 100%;
      object-fit: cover;
    }

    .operator_name {
      /* ygpt-flex ygpt-flex-col */
      display: flex;
      flex-direction: column;

      .inner {
        /* ygpt-text-sm ygpt-font-medium */
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
`;

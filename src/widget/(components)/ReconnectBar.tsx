import { ArrowPathIcon } from "@heroicons/react/20/solid";
import styled, { keyframes } from "styled-components";
// import { useChatbot } from "../context/ChatbotContext";

export default function ReconnectBar() {
  // const { socketDisconnected } = useChatbot();

  // if (!socketDisconnected) return null;

  return (
    <Root>
      <div className="rotateLogo">
        <ArrowPathIcon height={16} />
      </div>
      <div className="">Reconnecting please wait..</div>
    </Root>
  );
}

const rotating = keyframes`
from {
    transform: rotate(0deg);
}
to {
    transform: rotate(360deg);
}
`;

const pulsing = keyframes`
from{
    opacity: 0.5;
}
to{
    opacity: 1;
}
`;

const Root = styled.div`
  background: #ffda6f;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  font-size: 12px;
  text-align: center;
  animation: ${pulsing} 1s linear infinite alternate;
  gap: 8px;

  .rotateLogo {
    animation: ${rotating} 2s linear infinite;
  }
`;

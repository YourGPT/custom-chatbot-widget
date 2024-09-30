import styled from "styled-components";
import { useChatbot } from "../context/ChatbotContext";

export default function ErrorBar() {
  const { error } = useChatbot();

  if (!error) return null;
  return <Root>{error}</Root>;
}

const Root = styled.div`
  background: #ffeeee;
  color: #ff2525;
  padding: 4px;
  text-align: center;
  font-size: 14px;
`;

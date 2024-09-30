import Chatbot from "./(components)/Chatbot";
import CompactChatbotProvider from "./context/CompactContext";

export default function Compact() {
  return (
    <CompactChatbotProvider>
      <Chatbot />
    </CompactChatbotProvider>
  );
}

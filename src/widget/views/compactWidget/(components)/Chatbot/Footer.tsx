import { motion } from "framer-motion";
import ChatActionBar from "../../../../(components)/ChatActionBar";
import { useCompactChatbot } from "../../context/CompactContext";
import { onMessagePayloadD } from "../../../../types/message";
// import { useWidget } from "../../../context/WidgetContext";
import BrandingBar from "../../../../(components)/BrandingBar";
export default function Footer({ onSend }: { onSend: (data: onMessagePayloadD) => void }) {
  const { loadingStatus, messages } = useCompactChatbot();
  const isGenerating = loadingStatus !== null || Boolean(messages[messages?.length - 1]?.loadingStatus);

  return (
    <motion.div
      variants={{
        show: {
          opacity: 1,
          y: 0,
        },
        hide: {
          opacity: 0,
          y: "100%",
        },
      }}
      className=""
      transition={{
        type: "tween",
      }}
    >
      <ChatActionBar onSend={onSend} isGenerating={isGenerating} />
      <BrandingBar />
    </motion.div>
  );
}

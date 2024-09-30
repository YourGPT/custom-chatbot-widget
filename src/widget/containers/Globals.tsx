import { useEffect } from "react";
import { useChatbot } from "../context/ChatbotContext";
// import RouteDataManager from "./RouteDataManager";
import TriggerManager from "./TriggerManager";
// import SentryData from "./SentryData";
import { registerVisitCount } from "../utils/registers";

export default function Globals() {
  const { chatbotSettings } = useChatbot();

  //CODE INJECTION
  useEffect(() => {
    const cssToInject = chatbotSettings?.widget_css || "";
    const jsToInject = chatbotSettings?.widget_javascript || "";

    if (cssToInject) {
      const style = document.createElement("style");
      style.innerHTML = cssToInject;
      document.head.appendChild(style);
    }
    if (jsToInject) {
      const script = document.createElement("script");
      script.innerHTML = jsToInject;
      document.head.appendChild(script);
    }
  }, [chatbotSettings?.widget_css, chatbotSettings?.widget_javascript]);

  useEffect(() => {
    if (chatbotSettings?.widget_uid) registerVisitCount(chatbotSettings?.widget_uid || "");
  }, [chatbotSettings?.widget_uid]);

  return (
    <>
      {/* <SentryData /> */}
      {/* <UserStateListener /> */}
      {/* <RouteDataManager /> */}
      <TriggerManager />
    </>
  );
}

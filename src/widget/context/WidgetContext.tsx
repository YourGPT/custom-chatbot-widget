import { createContext, useContext } from "react";
import { YOUR_GPT_LAYOUT } from "../utils/constants";
import { WidgetLayoutD } from "../types/layout/global";
import { ChatbotSettingD } from "../types";
import { useChatbot } from "./ChatbotContext";

type WidgetContextD = {
  layout: WidgetLayoutD | null;
  setting: ChatbotSettingD | null;
  loading: boolean;
};

export const WidgetContext = createContext<WidgetContextD>({} as WidgetContextD);

export function useWidget() {
  return useContext(WidgetContext);
}

export default function WidgetProvider({ children }: { children: React.ReactNode }) {
  const { chatbotSettings, loadingChatbotSettings } = useChatbot();

  return (
    <WidgetContext.Provider
      value={{
        loading: loadingChatbotSettings,
        layout: chatbotSettings?.layout || YOUR_GPT_LAYOUT,
        setting: chatbotSettings,
      }}
    >
      {children}
    </WidgetContext.Provider>
  );
}

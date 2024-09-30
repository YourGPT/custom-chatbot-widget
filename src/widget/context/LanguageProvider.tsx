import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";

// import fr from "../lang/fr.json";
import en from "../lang/en.json";
// import it from "../lang/it.json";
// import ar from "../lang/ar.json";
// import hi from "../lang/hi.json";
// import ru from "../lang/ru.json";
// import ja from "../lang/ja.json";
// import es from "../lang/es.json";
import { IntlProvider } from "react-intl";
// import { useWidget } from "./WidgetContext";
import { StorageManager } from "../utils/storage";
import { useChatbot } from "./ChatbotContext";
import { LanguageCodesE } from "../types/layout/lang";
import { useWidget } from "./WidgetContext";
import { getDeviceLocale } from "../utils/helper";

// const local = navigator.language;

// let lang: any = {};

// if (local.includes("en")) {
//   lang = en;
// } else {
//   if (local === "fr") {
//     lang = Fr;
//   }
// }

type LanguageContextType = {
  selectLanguage: (e: LanguageCodesE) => void;
  locale: LanguageCodesE;
  defaultLocale: LanguageCodesE;
};

const LanguageContext = createContext<LanguageContextType>({} as LanguageContextType);

export const useLanguage = () => useContext(LanguageContext);

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState(() => {
    const deviceLocale = getDeviceLocale() as LanguageCodesE;
    return deviceLocale;
  });
  const { layout } = useWidget();

  const [messages, setMessages] = useState<any>(en);
  // const { setting } = useWidget();
  const { widgetUid } = useChatbot();

  const selectLanguage = useCallback(
    (e: LanguageCodesE) => {
      const newLocale = e;
      setLocale(newLocale);
      StorageManager.setStorage({ language: newLocale, widgetUid });
    },
    [widgetUid]
  );

  useEffect(() => {
    async function loadMessages() {
      let messages: any = null;

      try {
        messages = await import(`../lang/${locale}.json`);
      } catch (err) {
        messages = en;
      }

      if (messages) {
        setMessages(messages);
      }
    }

    loadMessages();
  }, [locale]);

  useEffect(() => {
    const stored = StorageManager.getStorage(widgetUid);

    if (stored && stored.language) {
      const storedLocale = stored.language as LanguageCodesE;
      selectLanguage(storedLocale);
    } else {
      selectLanguage(layout?.defaultLanguage || LanguageCodesE.en);
    }
  }, [widgetUid, layout, selectLanguage]);

  useEffect(() => {
    const deviceLocale = getDeviceLocale() as LanguageCodesE;
    if (layout?.supportedLanguages?.some((i) => i === deviceLocale)) {
      setLocale(deviceLocale);
    } else {
      setLocale(layout?.defaultLanguage || LanguageCodesE.en);
    }
  }, [layout?.defaultLanguage, layout?.supportedLanguages]);

  return (
    <LanguageContext.Provider value={{ selectLanguage, locale, defaultLocale: layout?.defaultLanguage || LanguageCodesE.en }}>
      <IntlProvider messages={messages} locale={locale} defaultLocale="en">
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
}

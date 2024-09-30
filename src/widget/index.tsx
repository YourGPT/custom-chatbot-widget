// import { useMemo } from "react";
import ChatbotProvider, { useChatbot } from "./context/ChatbotContext";
import Compact from "./views/compactWidget";
// import Tabs from "./views/tabsWidget";
import ChatbotFrame from "./(components)/ChatbotFrame";
import WidgetButton from "./(components)/WidgetButton";
import WidgetProvider, { useWidget } from "./context/WidgetContext";
import { GlobalStyles, RootStyles } from "./styles/RootStyles";
import LanguageProvider, { useLanguage } from "./context/LanguageProvider";
import { WidgetPlace } from "./types";
import { YOUR_GPT_LAYOUT } from "./utils/constants";
// import ViewsAtRoot from "./containers/ViewsAtRoot";
import { LanguageCodesE } from "./types/layout/lang";
import WelcomePop from "./(components)/WelcomePop";
// import ReconnectBar from "./(components)/ReconnectBar";
import Globals from "./containers/Globals";
// import styled from "styled-components";
// import { NoSymbolIcon } from "@heroicons/react/20/solid";

// const Content = () => {
//   const { layout } = useWidget();

//   // const content = useMemo(() => {
//   //   if (layout?.type === "compact") {
//   //     return <Compact />;
//   //   } else if (layout?.type === "tab") {
//   //     return <Tabs />;
//   //   } else {
//   //     return <></>;
//   //   }
//   // }, [layout?.type]);

//   return (
//     <>
//       {/* {content} */}
//       <Compact />
//       {/* <ViewsAtRoot /> */}
//     </>
//   );
// };

const Root = () => {
  const { isFullPage, widgetPlace } = useChatbot();
  const { layout, loading, setting } = useWidget();
  const { locale } = useLanguage();

  if (widgetPlace !== "showcase") {
    if (loading || !setting?.widget_uid) return null;
  }

  // const blockMsg = <NoSymbolIcon height={32} />;

  return (
    <>
      <GlobalStyles direction={[LanguageCodesE.ar, LanguageCodesE.he].includes(locale) ? "rtl" : "ltr"} layout={layout || YOUR_GPT_LAYOUT} />

      <Globals />
      <RootStyles className={`widgetPlace-${widgetPlace} yourgptChatbotRoot`}>
        {isFullPage ? (
          <>
            <div className="fullPageContainer">
              {/* <ReconnectBar /> */}
              {/* <Content /> */}
              <Compact />

              {/* {blocked && (
                <Blocked>
                  <div>{blockMsg}</div>
                </Blocked>
              )} */}
            </div>
          </>
        ) : (
          <>
            <ChatbotFrame>
              {/* <ReconnectBar /> */}
              {/* <Content /> */}
              <Compact />

              {/* {blocked && (
                <Blocked>
                  <div>{blockMsg}</div>
                </Blocked>
              )} */}
            </ChatbotFrame>
            <WelcomePop />
            <WidgetButton />
          </>
        )}
      </RootStyles>
    </>
  );
};

export default function Widget({ widgetPlace = "chatbot", widgetUid }: { widgetPlace?: WidgetPlace; widgetUid: string }) {
  return (
    <div className="ygpt-chatbot">
      <ChatbotProvider widgetPlace={widgetPlace} widgetUid={widgetUid}>
        <WidgetProvider>
          <LanguageProvider>
            <Root />
          </LanguageProvider>
        </WidgetProvider>
      </ChatbotProvider>
    </div>
  );
}

// const Blocked = styled.div`
//   background-color: rgba(0, 0, 0, 0.9);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   color: #ff5a5a;
//   position: absolute;
//   left: 0;
//   top: 0;
//   width: 100%;
//   height: 100%;
//   z-index: 160;
// `;

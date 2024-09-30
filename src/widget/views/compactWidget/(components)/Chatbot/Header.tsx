import { RiExpandLeftLine, RiExpandRightLine } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { useChatbot } from "../../../../context/ChatbotContext";
import { useWidget } from "../../../../context/WidgetContext";
import ChatbotLogo from "../../../../(components)/logos/Chatbot";
import { YOUR_GPT_LAYOUT } from "../../../../utils/constants";
import { useCompactChatbot } from "../../context/CompactContext";
import { IconBtn } from "../../../../(components)/styles";
import LanguagePicker from "../../../../(components)/LanguagePicker";
import { useEffect } from "react";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
// import { useState } from "react";
// import { useIntl } from "react-intl";

export default function Header() {
  const { setExpanded, expanded, setChatbotPopup, isFullPage } = useChatbot();
  const { clearSession } = useCompactChatbot();
  const { layout, setting } = useWidget();
  // const [languagePopup, setLanguagePopup] = useState(false);
  // const intl = useIntl();

  useEffect(() => {
    const refreshIcon = document.querySelector(".refreshIcon");
    let timer: any;

    function onRefreshHitSpinIcon() {
      refreshIcon?.classList.add("spinIt");
      timer = setTimeout(() => {
        refreshIcon?.classList.remove("spinIt");
      }, 1000);
    }

    refreshIcon && refreshIcon.addEventListener("click", onRefreshHitSpinIcon);

    return () => {
      clearTimeout(timer);
      refreshIcon && refreshIcon.removeEventListener("click", onRefreshHitSpinIcon);
    };
  }, []);

  return (
    <div className="header" style={{ background: "var(--yourgptChatbotPrimaryColor)", color: "var(--yourgptChatbotTextOnPrimaryColor)" }}>
      {/* LEFT  */}
      <div className="left">
        {!isFullPage && (
          <button onClick={() => setExpanded((s) => !s)} className="expander">
            {expanded ? <RiExpandRightLine size={20} /> : <RiExpandLeftLine size={20} />}
          </button>
        )}

        <div className="avatar">{setting?.logo ? <img src={setting?.logo} alt="Avatar" /> : <ChatbotLogo />}</div>

        <div className="">
          <div className="name">{setting?.name}</div>
        </div>
      </div>

      {/* RIGHT  */}
      <div className="right">
        <LanguagePicker />

        <IconBtn style={{ cursor: "pointer" }} onClick={() => clearSession()} color={layout?.colors.textOnPrimary || YOUR_GPT_LAYOUT.colors.textOnPrimary}>
          <ArrowPathIcon className="refreshIcon" height={20} width={20} />
        </IconBtn>
        {!isFullPage && (
          <IconBtn style={{ cursor: "pointer" }} onClick={() => setChatbotPopup(false)} className="" color={layout?.colors.textOnPrimary || YOUR_GPT_LAYOUT.colors.textOnPrimary}>
            <IoMdClose size={20} />
          </IconBtn>
        )}
      </div>
    </div>
  );
}

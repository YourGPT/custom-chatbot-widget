import { useIntl } from "react-intl";
import { HIDE_FOOTER } from "../utils/helper";
import { useChatbot } from "../context/ChatbotContext";
import { useWidget } from "../context/WidgetContext";

export default function BrandingBar() {
  const intl = useIntl();
  const { isFullPage } = useChatbot();
  const { setting } = useWidget();

  if (HIDE_FOOTER && isFullPage) return null;

  if (!setting?.branding_title) return null;
  //   `https://yourgpt.ai/chatbot`

  return (
    <div className="brandingBar">
      <div>
        <span style={{ opacity: "50%", fontSize: "inherit" }}>
          {intl.formatMessage({
            id: "PoweredBy",
            defaultMessage: "Powered by",
          })}{" "}
        </span>
        <span style={{ fontWeight: "bold" }}>
          <a
            target="_blank"
            rel="noreferrer"
            style={{
              textDecoration: "none",
              color: "inherit",
              fontSize: 14,
              opacity: "70%",
            }}
            href={setting.branding_link || "#"}
            // href={setting?.branding_link || `https://yourgpt.ai/chatbot`}
          >
            {setting?.branding_title || "YourGPT"}
          </a>
        </span>
      </div>
    </div>
  );
}

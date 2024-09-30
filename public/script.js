// const WIDGET_ENDPOINT = "https://widget.yourgpt.ai";
const WIDGET_ENDPOINT = "https://custom-widget-ten.vercel.app";
const WHITELABEL_WIDGET_ENDPOINT = "https://widget.d4ai.cx";

//SDK
const YOURGPT_CHATBOT_SDK = {
  initScript: () => {
    if (!document) {
      console.log("YGPT SDK: No document found");
      return;
    }
    const scriptTag = document.getElementById("yourgpt-custom-widget-script");
    if (!scriptTag) {
      console.log("YGC SDK: No script tag found with id");
    }
    const isWhitelabel = false;
    // const isWhitelabel = !scriptTag.src.includes("yourgpt");

    //DECIDE THE ENDPOINTS
    // const widgetEndpoint = WIDGET_ENDPOINT;
    const widgetEndpoint = isWhitelabel ? WHITELABEL_WIDGET_ENDPOINT : WIDGET_ENDPOINT;

    window.$yourgptChatbot = {
      ...(window.$yourgptChatbot || {}),
      WIDGET_ENDPOINT: widgetEndpoint,
    };

    //NEW SCRIPT
    const widgetCode = window.YGC_WIDGET_ID;
    let scriptPath = "";

    if (widgetCode) {
      window.YOURGPT_WIDGET_UID = widgetCode;
      scriptPath = widgetEndpoint + "/custom-widget.js";
      appendCSSFileToHead(widgetEndpoint + "/custom-widget.css");
    } else {
      console.log("YGC ID NOT FOUND");
      return;
    }

    const root = document.createElement("div");
    root.style.zIndex = 99999;
    root.style.position = "fixed";
    root.id = "ygc-custom-widget-root";
    const gptSc = document.createElement("script");

    gptSc.src = scriptPath;
    gptSc.async = true;
    gptSc.type = "module";

    if (!document.body) {
      console.log("YGPT SDK: No body tag found");
      return;
    }

    document.body?.appendChild(root);
    document.getElementsByTagName("head")[0]?.appendChild(gptSc);
  },
};

(function () {
  window.$yourgptChatbot = {
    q: [],
    execute: function (action, ...data) {
      this.q.push(["execute", action, ...data]);
    },
    on: function (event, callback) {
      this.q.push(["on", event, callback]);
    },
    off: function (event, callback) {
      this.q.push(["off", event, callback]);
    },
    set: function (key, value) {
      this.q.push(["set", key, value]);
    },
  };

  document.addEventListener("DOMContentLoaded", YOURGPT_CHATBOT_SDK.initScript);
  YOURGPT_CHATBOT_SDK.initScript();
})();

// HELPERS
function appendCSSFileToHead(cssFilePath) {
  const linkElement = document.createElement("link");
  linkElement.rel = "stylesheet";
  linkElement.type = "text/css";
  linkElement.href = cssFilePath;
  document.head?.appendChild(linkElement);
}

//EXAMPLE
{
  /* <script src="https://widget.yourgpt.ai/script.js" id="yourgpt-chatbot" widget="eb2a98b4-0809-4b5a-9134-bef1166af8fb"></script>; */
}

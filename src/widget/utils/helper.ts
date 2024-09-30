import { parseToHsl } from "polished";
import { DeviceTypeD, PlatformTypeD } from "../types";
import { MessageD, RenderMessageItem } from "../types/message";
import { FULL_SCREEN_ROUTE } from "./constants";
import { SessionData } from "../types/socket";

const AUDIO = new Audio("https://assets.yourgpt.ai/widget/messageSound3.mp3");

export const getVisitorName = (n: string | number) => {
  if (typeof n === "undefined") return "";
  const str = n.toString()?.slice(-4);
  return str.split("").reverse().join("");
};

export function customDebounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
  context?: any // Add an optional context parameter
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>): void {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(context, args); // Use the provided context
    }, delay);
  };
}

export const parseStreamString = (str: string) => str.replaceAll("[LINE_END]", "\n").replaceAll("||", "|\n|").replaceAll(":|", "\n|") || "";

export function playSound() {
  AUDIO.play();
}

export const getChatbotCreds = (): { widgetUid: string; fullPage: boolean } | null => {
  if (import.meta.env.DEV) {
    if (window.location.pathname.split("/").length === 2) {
      return {
        widgetUid: window.location.pathname.split("/")[1] || "",
        fullPage: false,
      };
    } else if (window.location.pathname.split("/").length === 3) {
      return {
        widgetUid: window.location.pathname.split("/")[2] || "",
        fullPage: false,
      };
    }
  } else {
    if (window.YOURGPT_WIDGET_UID) {
      return {
        widgetUid: window.YOURGPT_WIDGET_UID,
        fullPage: false,
      };
    }
    const currentPath = window?.location?.pathname;
    const domainName = window?.location?.hostname;

    const splitted = currentPath.split("/");

    const cssCheck = document.getElementById("ygc-custom-widget-root")?.classList.contains("ygc_fullscreen");

    if (domainName === FULL_SCREEN_ROUTE || cssCheck) {
      if (splitted.length === 2) {
        return {
          widgetUid: splitted[1] || "",
          fullPage: true,
        };
      } else if (splitted.length === 3) {
        return {
          widgetUid: splitted[2] || "",
          fullPage: true,
        };
      }
    } else {
      return null;
    }
  }
  return null;
};

export const getRenderMessageItem = (message: MessageD): RenderMessageItem => {
  //NEW APPRAOCH OF JSON

  let messageString = "";

  if (message.message) {
    messageString = message.message || "";
  } else {
    messageString = message.message || "";
  }

  //OLD APPROACH ONLY MESSAGE TEXT

  return {
    text: messageString,
    id: message.message_id || message?.id,
    localId: message.localId,
    sent: message?.send_by == "user",
    sendBy: message?.send_by,
    rate: message.rate || null,
    user: {
      pic: message.operator?.profile_pic,
      fName: message.operator?.first_name,
      name: message.operator?.name,
    },
    loadingStatus: message.loadingStatus,
    createdAt: message.createdAt,
    links: message.links || [],
    session_id: message.session_id,
    choices: message?.choices || null,
    content_type: message.content_type || "text",
    url: message.url || null,
  };
};

export const DEVICE_TYPE: DeviceTypeD = "desktop";
export const PLATFORM: PlatformTypeD = "mac";

// export const MOBILE_APP_VIEW = new URL(window.location.href).searchParams.has("mobileAppView");
export const HIDE_HEADER = new URL(window.location.href).searchParams.has("hideHeader");
export const HIDE_LEARN_MORE = new URL(window.location.href).searchParams.has("hideLearnMore");
// export const HIDE_LANGUAGE = new URL(window.location.href).searchParams.has("hideLanguage");
// export const HIDE_FEEDBACK = new URL(window.location.href).searchParams.has("hideFeedback");
export const HIDE_FOOTER = new URL(window.location.href).searchParams.has("hideFooter");

export const getTranslatedText = ({ defaultLocale, locale, text }: { defaultLocale: string; locale: string | null; text: any }) => {
  if (!text) return "";

  if (locale && text[locale]) {
    return text[locale];
  } else if (text[defaultLocale] && defaultLocale) {
    return text[defaultLocale];
  } else {
    return "";
  }
};

export const convertToHsl = (color: string) => {
  const { hue, saturation, lightness } = parseToHsl(color);
  return `${(hue * 1).toFixed(0)} ${Math.round(saturation * 100)}% ${Math.round(lightness * 100)}%`;
};

export const getDeviceLocale = () => {
  const locale = navigator.language.split("-")[0];

  return locale;
};

type KeyValue = { [key: string]: any };

export function formatSdkData(...args: Array<string | [string, any] | KeyValue>): KeyValue {
  const result: KeyValue = {};

  let currentKey: string | null = null;

  args.forEach((arg) => {
    if (typeof arg === "string") {
      if (currentKey === null) {
        // If no current key, set the current key
        currentKey = arg;
      } else {
        // If there's a current key, treat this string as a value and reset current key
        result[currentKey] = arg;
        currentKey = null;
      }
    } else if (Array.isArray(arg)) {
      // Handle case where argument is an array containing key-value pairs
      const [key, value] = arg;
      result[key] = value;
    } else if (typeof arg === "object" && arg !== null) {
      // Handle case where argument is an object with key-value pairs
      if (Array.isArray(arg)) {
        // Handle case where object is an array containing key-value pairs
        arg.forEach(([key, value]) => {
          result[key] = value;
        });
      } else {
        // Handle case where object is a regular object with key-value pairs
        Object.entries(arg).forEach(([key, value]) => {
          result[key] = value;
        });
      }
    }
  });

  return result;
}

export function iOS() {
  return navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad");
}

export function isNumeric(str: any) {
  return !isNaN(parseFloat(str)) && isFinite(str);
}

export const isSessionDataValid = (sessionData: SessionData | undefined | null) => {
  let valid = false;
  if (sessionData?.session_uid && isNumeric(sessionData.session_uid)) {
    valid = true;
  }
  return valid;
};

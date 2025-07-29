import { FULL_SCREEN_ROUTE } from "./constants";
import { getChatbotCreds } from "./helper";

export const API_ENDPOINT = "https://api.yourgpt.ai";
export const SOCKET_ENDPOINT = "https://wss.yourgpt.ai";

export const WHITELABEL_API_ENDPOINT = "https://api.d4ai.chat";
export const WHITELABEL_SOCKET_ENDPOINT = "https://wss.d4ai.chat";

let isYourGpt = true;

const chatbotCreds = getChatbotCreds();

if (chatbotCreds?.fullPage) {
  if (window.location.hostname === FULL_SCREEN_ROUTE) {
    isYourGpt = true;
  } else {
    isYourGpt = false;
  }
} else {
  const fromWidget = window?.$yourgptChatbot?.WIDGET_ENDPOINT;
  if (fromWidget && !fromWidget?.includes("yourgpt")) {
    isYourGpt = false;
  } else {
    isYourGpt = true;
  }
}

export const getApiEndpoint = () => {
  return isYourGpt ? API_ENDPOINT : WHITELABEL_API_ENDPOINT;
};
export const getSocketEndpoint = () => {
  return isYourGpt ? SOCKET_ENDPOINT : WHITELABEL_SOCKET_ENDPOINT;
};

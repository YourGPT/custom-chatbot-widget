import { MessageD } from "../../types/message";
import { SessionData } from "../../types/socket";
import { LocalStorageManager } from "./manager";

const storage = new LocalStorageManager();

type Layout = {
  sessionData: SessionData | null;
  messages: MessageD[];
};
type DataStoreT = {
  // visitorUid?: string;
  compactLayout: Layout;
  tabLayout: { sessions: SessionData[] };
  leadSubmitted?: boolean;
  language?: string;
  interacted?: boolean;
  routeDataUpdateMappings?: { [key: string]: string };
  visitCount?: number;
  sessionCreated?: boolean;
};

type StorageManagerT = {
  setStorage: (data: {
    compactSession?: SessionData;
    compactMessages?: MessageD[];
    tabSessions?: SessionData[];
    widgetUid: string;
    // visitorUid?: string;
    leadSubmitted?: boolean;
    language?: string;
    interacted?: boolean;
    visitCount?: number;
    sessionCreated?: boolean;
  }) => void;
  addRouteDataUpdateMappings: (widgetUid: string, data: { key: string; value: string }) => void;
  getRouteDataItem: (widgetUid: string, key: string) => { key: string; value: string } | null;
  getStorage: (widgetUid: string) => DataStoreT | null;
  clearCompactSession: (widgetUid: string) => void;
  clearTabSession: (widgetUid: string) => void;
  clearStorage: (widgetUid: string) => void;
};

const defaultLayout: Layout = { sessionData: null, messages: [] };

const clearLayout = (widgetUid: string, layoutKey: keyof DataStoreT) => {
  const objStr = storage.getItem(`ygc-custom-chatbot-${widgetUid}`) || storage.getItem(`yourgpt-custom-chatbot-${widgetUid}`);

  if (objStr) {
    const obj = JSON.parse(objStr);
    obj[layoutKey] = defaultLayout;
    storage.setItem(`ygc-custom-chatbot-${widgetUid}`, JSON.stringify(obj));
  }
};
const getStorageItem = (widgetUid: string): DataStoreT | null => {
  const objStr = storage.getItem(`ygc-custom-chatbot-${widgetUid}`) || storage.getItem(`yourgpt-custom-chatbot-${widgetUid}`);
  return objStr ? JSON.parse(objStr) : null;
};

const setStorageItem = (widgetUid: string, data: DataStoreT) => {
  storage.setItem(`ygc-custom-chatbot-${widgetUid}`, JSON.stringify(data));
};

export const StorageManager: StorageManagerT = {
  setStorage: ({ compactSession, compactMessages, tabSessions, widgetUid, leadSubmitted, language, interacted, visitCount, sessionCreated }) => {
    const mainOb: DataStoreT = getStorageItem(widgetUid) || {
      compactLayout: defaultLayout,
      tabLayout: { sessions: [] },
      leadSubmitted: false,
      language: undefined,
      interacted: undefined,
      visitCount: 0,
      sessionCreated: false,
    };

    mainOb.compactLayout.sessionData = compactSession ?? mainOb.compactLayout.sessionData;
    mainOb.compactLayout.messages = compactMessages ?? mainOb.compactLayout.messages;
    // mainOb.visitorUid = visitorUid ?? mainOb.visitorUid;
    mainOb.tabLayout.sessions = tabSessions ?? mainOb.tabLayout.sessions;
    mainOb.leadSubmitted = leadSubmitted ?? mainOb.leadSubmitted;
    mainOb.language = language ?? mainOb.language;
    mainOb.interacted = interacted ?? mainOb.interacted;
    mainOb.visitCount = visitCount !== undefined ? visitCount : mainOb.visitCount;
    mainOb.sessionCreated = sessionCreated !== undefined ? sessionCreated : mainOb.sessionCreated;

    setStorageItem(widgetUid, mainOb);
  },
  addRouteDataUpdateMappings: (widgetUid: string, data: { key: string; value: string }) => {
    const mainOb = getStorageItem(widgetUid);
    if (!mainOb) return;
    if (!mainOb.routeDataUpdateMappings) {
      mainOb.routeDataUpdateMappings = {};
    }
    mainOb.routeDataUpdateMappings[data.key] = data.value;
    setStorageItem(widgetUid, mainOb);
  },
  getRouteDataItem: (widgetUid: string, key: string) => {
    const mainOb = getStorageItem(widgetUid);
    if (!mainOb || !mainOb.routeDataUpdateMappings) return null;
    if (!mainOb.routeDataUpdateMappings[key]) return null;
    return { key, value: mainOb.routeDataUpdateMappings[key] };
  },

  getStorage: getStorageItem,

  clearCompactSession: (widgetUid: string) => clearLayout(widgetUid, "compactLayout"),

  clearTabSession: (widgetUid: string) => clearLayout(widgetUid, "tabLayout"),

  clearStorage: (widgetUid: string) => {
    storage.removeItem(`yourgpt-custom-chatbot-${widgetUid}`);
    storage.removeItem(`ygc-custom-chatbot-${widgetUid}`);
  },
};

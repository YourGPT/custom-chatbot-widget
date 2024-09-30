import { MessageEventResponse, MessageFrom } from "./socket";

export type MessageContentTypeD = "text" | "image" | "video" | "audio" | "picker";
export type MessageD = MessageEventResponse &
  SessionMessageItem & {
    loadingStatus?: "streaming" | "loading" | null;
    stream?: boolean;
    createdAt: string | number | null;
    links?: any[];
    rate?: null | "1" | "0";
  };

export type SessionMessageItem = {
  // session_id: number;
  send_by?: MessageFrom;
  id?: number;
  // type: number;
  seen?: string;
  // createdAt: string;
};

export type MessagesLoadingStatus = "loading" | "typing" | null;

export type RenderMessageItem = {
  text: string;
  id?: number;
  localId?: number;
  sent: boolean;
  sendBy: MessageFrom;
  rate: null | "1" | "0";
  user?: {
    fName?: string;
    pic?: string;
    name?: string;
  };
  loadingStatus?: "streaming" | "loading" | null;
  createdAt: string | number | null;
  links: string[];
  session_id?: string;
  choices: MessageActionBtnItemD[] | null;
  url?: string | null;
  content_type: MessageContentTypeD;
};

export type onMessageActionBtnPayloadD = { index?: number; messageId: number; action: MessageActionBtnItemD[] };

export type MessageActionBtnValuesD = "like" | "dislike" | "requesthumanoperator" | "Re-enable AI";

export type MessageActionBtnItemD = {
  icon: string;
  text?: string; // depriciated
  label: string;
  value: MessageActionBtnValuesD;
  selected: boolean;
};

export type onMessagePayloadD = {
  content_type: "text" | "image" | "audio";
  url?: string;
  message?: string;
};

import { MessageActionBtnItemD, MessageContentTypeD } from "./message";

export type SessionData = {
  id: number;
  integration_id: number;
  status: string;
  device_type: string;
  platform: string;
  country: null | string;
  project_id: number;
  session_uid: any;
  session_id: string;
  updatedAt: string;
  createdAt: string;
  token: string;
};

export type MessagesReceivedType = "text" | "stream";

export type MessageEventResponse = {
  type?: MessagesReceivedType;
  send_by: MessageFrom;
  origin?: string;
  localId: any;
  choices?: MessageActionBtnItemD[] | null | undefined;
  content_type?: MessageContentTypeD;
  url?: string;
  message_id?: number;

  stream_url?: string;
  stream_token?: string;

  message?: string;
  session_uid?: string;
  session_id?: string;
  operator?: {
    id: string;
    first_name: string;
    last_name: string;
    phone_no: any;
    phone_code: any;
    profile_pic: string;
    name: string;
    email: string;
    password: string;
    username: string;
    firebase_uid: string;
    country: string;
    email_verified: string;
    type: any;
    createdAt: string;
    updatedAt: string;
    deleted_at: any;
  };
};

export type MessageComposeD = {
  session_uid: string;
  widget_uid: string;
  send_by: MessageFrom;
  type: "start" | "stop";
  content: { type: "typing" | "streaming" | "loading"; message?: string; choices?: MessageActionBtnItemD[]; message_id?: number | null };
};

export type EditMessageEventResponse = {
  id: number;
  session_id: number;
  send_by: string;
  rate: any;
  message: string;
  type: number;
  seen: string;
  user_id: any;
  createdAt: string;
};

export type SocketState = "idle" | "creatingSession" | "joined" | "error" | "resettingSession" | "connected";

export type MessageFrom = "user" | "operator" | "assistant";

export type VisitorStatus = "away" | "online" | "offline";

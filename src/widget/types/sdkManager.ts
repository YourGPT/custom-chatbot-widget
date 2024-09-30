export type setVisitorArgs = { visitor_uid: string; widget_uid: string; data: { [key: string]: string } };
export type setSessionArgs = { session_uid: string; widget_uid: string; data: { [key: string]: string } };
export type setContactArgs = {
  visitor_uid: string;
  widget_uid: string;
  data: {
    phone?: string;
    name?: string;
    email?: string;
    ext_user_id?: string;
  };
};

export type sdkActionsD = {
  openChatPopup: () => void;
  closeChatPopup: () => void;
  setVisitorData: (...data: any) => void;
  setSessionData: (...data: any) => void;
  onInit: () => void;
  openWelcomeMessage: () => void;
  closeWelcomeMessage: () => void;
};

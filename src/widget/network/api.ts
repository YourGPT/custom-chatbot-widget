import { post } from "./index";

export const getChatbotSettingApi = (data: { widget_uid: string }) => {
  const raw = new URLSearchParams();
  raw.append("widget_uid", data.widget_uid);
  return post({
    route: "/chatbot/v1/public/getChatbotSetting",
    data: raw,
    config: {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  });
};
export const getSessionsApi = (data: { visitor_uid: string; page?: number; limit?: number; orderBy: "asc" | "desc"; widget_uid: string }) => {
  return post({
    route: `/chatbot/v1/public/getSessionByVisitorId`,
    data: JSON.stringify(data),
    config: {
      headers: {
        "Content-type": "application/json",
      },
    },
  });
};

export const getSessionMessagesApi = (data: { session_uid: string; limit?: number; page?: number }) => {
  return post({
    route: `/chatbot/v1/public/getSessionMessage`,
    data: JSON.stringify(data),
    config: {
      headers: {
        "Content-type": "application/json",
      },
    },
  });
};

export const submitLeadFormApi = (data: { session_uid: string; data: any; visitor_uid: string; widget_uid: string }) => {
  return post({
    route: `/chatbot/v1/public/submitPrechattingForm`,
    data: JSON.stringify(data),
    config: {
      headers: {
        "Content-type": "application/json",
      },
    },
  });
};
export const getMessageSignedUrlApi = (data: { file_name: string; project_id: string }) => {
  return post({
    route: `/chatbot/v1/public/getMessageSignedUrl`,
    data: JSON.stringify(data),
    config: {
      headers: {
        "Content-type": "application/json",
      },
    },
  });
};

export const generateFollowUpQuestionsApi = (data: { session_uid: string; widget_uid: string; message_id: string }) => {
  return post({
    route: `/chatbot/v1/public/generateFollowupQuestion`,
    data: JSON.stringify(data),
    config: {
      headers: {
        "Content-type": "application/json",
      },
    },
  });
};

export const textToSpeechApi = (data: { widget_uid: string; session_uid: string; message_id: string }) => {
  return post({
    route: `/chatbot/v1/public/textToSpeech`,
    data: JSON.stringify(data),
    config: {
      headers: {
        "Content-type": "application/json",
      },
    },
  });
};

export const createSessionApi = ({ domain, widget_uid }: { widget_uid: string; domain: string }) => {
  return post({
    route: "/chatbot/v1/createSession",
    data: JSON.stringify({ widget_uid, domain }),
    config: {
      headers: {
        "Content-type": "application/json",
      },
    },
  });
};

export const sendMessageApi = ({ ...raw }: { session_uid: string; message: string; widget_uid: string; domain: string; is_stream: boolean }) => {
  return post({
    route: "/chatbot/v1/sendMessage",
    data: JSON.stringify({ ...raw }),
    config: {
      headers: {
        "Content-type": "application/json",
      },
    },
  });
};

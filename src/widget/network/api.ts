import { post } from "./index";

export const getChatbotSettingApi = (data: { widget_uid: string }) => {
  const raw = new URLSearchParams();
  raw.append("widget_uid", data.widget_uid);
  return post({
    route: `/api/v1/public/getChatbotSetting`,
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
    route: `/chatbot/v1/getSessionByVisitorId`,
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
    route: `/chatbot/v1/getSessionMessage`,
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
    route: `/chatbot/v1/submitPrechattingForm`,
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
    route: `/chatbot/v1/getMessageSignedUrl`,
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
    route: `/chatbot/v1/generateFollowupQuestion`,
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
    route: `/chatbot/v1/textToSpeech`,
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

export const getChatbotsApi = ({ token, ...raw }: { token: string; app_id: string; limit: string; page: string; orderBy: "asc" | "desc" }) => {
  return post({
    route: "/api/v1/getMyProjects",
    data: JSON.stringify({ ...raw }),
    config: {
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
    },
  });
};

export const getIntegrationSettingsApi = (data: { token: string; app_id: string; integration_id: string; project_uid: string }) => {
  return post({
    route: "/api/v1/getIntegrationSettings",
    data: JSON.stringify(data),
    config: {
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + data.token,
      },
    },
  });
};

import { WidgetLayoutD } from "./layout/global";
import { FieldD } from "./lead";
import { TriggerItemD } from "./trigger";

export type ChatbotSettingD = {
  // id: number;
  name: string;
  logo: string;
  widget_uid: string;
  layout?: WidgetLayoutD | null;
  enable_widget_form?: boolean;
  widget_form_field?: FieldD[];
  branding_title: string;
  branding_link: string;
  widget_css: string | null;
  widget_javascript: string | null;
  is_stream: "1" | "0";
  project_id: number;
  voice: {
    voice_reply: boolean;
    text_to_speech: boolean;
    voice: {
      id: string;
      name: string;
    };
  };

  chatbot_triggers: TriggerItemD[];

  // project_id: number;
  // language: string;
  // position: string;
  // welcome_message: string;
  // widget_color: string;
  // widget_text_color: string;

  // branding_color: string;
  // default_questions: string;
  // message_bg_color: string;
  // message_text_color: string;
  // reply_text_color: string;
  // reply_bg_color: string;
  // enable_navigation_tracking: any;
  // notify_to: any;
  // base_prompt: string;
  // createdAt: string;
  // updatedAt: string;
};

export type WidgetFormField = {
  id: number;
  name: string;
  widget_id: number;
  type: string;
  options: null;
  required: number;
  validation_rules: null;
  priority: number;
  deleted_at: null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
};

export type WidgetPlace = "showcase" | "chatbot";

export type PlatformTypeD = "ios" | "window" | "linux" | "mac";
export type DeviceTypeD = "mobile" | "desktop";

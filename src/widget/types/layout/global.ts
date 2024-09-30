import { LanguageCodesE } from "./lang";

export enum SocialPlaformsE {
  discord = "Discord",
  whatsapp = "WhatsApp",
  facebook = "Facebook",
  twitter = "Twitter",
  tiktok = "TikTok",
  instagram = "Instagram",
  youtube = "Youtube",
  reddit = "Reddit",
  medium = "Medium",
  telegram = "Telegram",

  github = "Github",
  slack = "Slack",
  dribbble = "Dribbble",
  producthunt = "Product Hunt",
  // linkedin = "LinkedIn",
  // quora = "Quora",
  // tumblr = "Tumblr",
  // pinterest = "Pinterest",
}

export type WidgetExternalLinkType = "link" | "card" | "socialMedia" | "video";

export type WidgetSocialMediaType = keyof SocialPlaformsE;

export type WidgetColorsD = {
  primary: string;
  textOnPrimary: string;
  botMessageBackground?: string;
  botMessageText?: string;
  userMessageBackground?: string;
  userMessageText?: string;
  surfaceColor?: string;
  textColor?: string;
};

export type WidgetSocialItemType = {
  link: string;
  type: keyof typeof SocialPlaformsE;
};

type WidgetExternalLinkTextD = {
  [value in LanguageCodesE]?: string;
};
export type WidgetExternalLinkD = {
  type: WidgetExternalLinkType;
  link?: string;
  text?: string | WidgetExternalLinkTextD;
  image?: string;
  socialItems?: WidgetSocialItemType[];
  visible?: boolean;
};

export type DefaultQuestionItemD = {
  id: any;
  question: string;
  label: string;
  children?: DefaultQuestionItemD[];
};

export type ChatActionBtnTypes = "image";

export type WidgetLayoutD = {
  type: "compact" | "tab";
  version: number;
  colors: WidgetColorsD;
  welcomeMessage: {
    [value in LanguageCodesE]?: string;
  };
  welcomePopup?: {
    text: {
      [value in LanguageCodesE]?: string[];
    };
    visible: boolean;
  };
  defaultQuestions: {
    [value in LanguageCodesE]?: DefaultQuestionItemD[];
  };
  defaultQuestionsSetting?: {
    renderAs?: "list" | "dropdown";
    dropdownPlaceholderText?: {
      [value in LanguageCodesE]?: string;
    };
    slider?: boolean;
  };
  externalLinks: WidgetExternalLinkD[];
  chatbotActionBarSettings?: {
    placeholderText?: {
      [value in LanguageCodesE]?: string;
    };
    buttons: {
      action: ChatActionBtnTypes;
    }[];
  };

  extraTabs?: {
    title: string;
    key: string;
    visibility: "1" | "0";
  }[];
  position: {
    x: number;
    y: number;
    align: "left" | "right";
  };
  defaultLanguage?: LanguageCodesE;
  supportedLanguages?: LanguageCodesE[];
  learnMoreLinks?: boolean;
  widgetBtnSize: number;
  followUpSuggestions?: boolean;
};

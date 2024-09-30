import { SocialPlaformsE } from "./global";

export type LayoutTypeD = "compact" | "tabs";

export type BottomTabsD = "homeTab" | "messagesTab" | "profileTab";

export type ScreensD = BottomTabsD | "chatScreen" | "allTabs";

export type SocialMediaD = {
  type: keyof SocialPlaformsE;
  link: string;
};

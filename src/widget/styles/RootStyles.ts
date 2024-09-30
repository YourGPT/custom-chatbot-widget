import { WidgetLayoutD } from "../types/layout/global";
import { YOUR_GPT_LAYOUT } from "../utils/constants";
import { convertToHsl } from "../utils/helper";
import "../utils/importCSS";

import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle<{ layout: WidgetLayoutD; direction?: "ltr" | "rtl" }>`

.ygpt-chatbot{

  --yourgptChatbotFontFamily: "Inter", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  --yourgptChatbotPrimaryColor: ${({ layout }) => layout.colors.primary || YOUR_GPT_LAYOUT.colors.primary};

  --yourgptChatbotTextOnPrimaryColor: ${({ layout }) => layout.colors.textOnPrimary || YOUR_GPT_LAYOUT.colors.textOnPrimary};

  --yourgptChatbotUserMessageBgColor: ${({ layout }) => layout.colors.userMessageBackground || "rgba(0, 0, 0, 0.12)"};
  --yourgptChatbotUserMessageTextColor: ${({ layout }) => layout.colors.userMessageText || "rgba(0, 0, 0, 0.9)"};

  --yourgptChatbotBotMessageBgColor: ${({ layout }) => layout.colors.botMessageBackground || layout.colors.primary || YOUR_GPT_LAYOUT.colors.primary};
  --yourgptChatbotBotMessageTextColor: ${({ layout }) => layout.colors.botMessageText || layout.colors.textOnPrimary || YOUR_GPT_LAYOUT.colors.textOnPrimary};

  --yourgptChatbotSurfaceColor: ${({ layout }) => layout.colors.surfaceColor || YOUR_GPT_LAYOUT.colors.surfaceColor || "#ffffff"};
  --yourgptChatbotTextColor: ${({ layout }) => layout.colors.textColor || "#000000"};
  --yourgptChatbotPositionX: ${({ layout }) => (layout.position.x === 0 ? 0 : layout.position.x || 20)}px;
  --yourgptChatbotPositionY: ${({ layout }) => (layout.position.y === 0 ? 0 : layout.position.y || 20)}px;
  --yourgptChatbotWidgetBtnSize: ${({ layout }) => layout.widgetBtnSize || 50}px;

  /* HSL COLORS  */
  --yourgptChatbotPrimaryColorHsl: ${(p) => convertToHsl(p.layout.colors.primary || YOUR_GPT_LAYOUT.colors.primary)};
  --yourgptChatbotSurfaceColorHsl: ${(p) => convertToHsl(p.layout.colors.surfaceColor || YOUR_GPT_LAYOUT.colors.surfaceColor || "#ffffff")};
  --yourgptChatbotTextColorHsl: ${(p) => convertToHsl(p.layout.colors.textColor || YOUR_GPT_LAYOUT.colors.textColor || "#000000")};
  --yourgptChatbotTextOnPrimaryColorHsl: ${(p) => convertToHsl(p.layout.colors.textOnPrimary || YOUR_GPT_LAYOUT.colors.textOnPrimary)};

  /* UTILITY COLLORS   */
  --yourgptChatbotOrange:30, 100%, 50%;

  font-weight: normal;

  font-family: var(--yourgptChatbotFontFamily);

  background: var(--yourgptChatbotSurfaceColor);
  color: var(--yourgptChatbotTextColor);

  
  
  & * {
    font-family: var(--yourgptChatbotFontFamily);
    direction: ${({ direction }) => direction || "ltr"};
  }
  
  .padX {
    padding-left: 16px;
    padding-right: 16px;
  }
  
  textarea::placeholder,
  input::placeholder {
    color: hsl(var(--yourgptChatbotTextColorHsl) / 0.6);
  }

  .fullPageContainer{
      height:100dvh;
      width: 100%;
  }

}

  .ygpts {
    &-widgetBtnOuter {
      ${({ layout }) => (layout.position?.align === "left" ? { left: `var(--yourgptChatbotPositionX)` } : { right: `var(--yourgptChatbotPositionX)` })}
      /* bottom: ${({ layout }) => layout.position.y || 20}px; */
      bottom: var(--yourgptChatbotPositionY);
      position: fixed;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-end;
    }
    &-welcomePopup {
      position: fixed;
      bottom: calc(var(--yourgptChatbotPositionY) + var(--yourgptChatbotWidgetBtnSize) + 10px);
      ${({ layout }) => (layout.position?.align === "left" ? { left: `var(--yourgptChatbotPositionX)` } : { right: `var(--yourgptChatbotPositionY)` })}
      z-index:2;
    }
    &-widgetBtn {
      height: var(--yourgptChatbotWidgetBtnSize);
      width: var(--yourgptChatbotWidgetBtnSize);
      display: flex;
      justify-content: center;
      align-items: center;
      /* overflow: hidden; */

      & > div{
        display: flex;
        justify-content: center;
        align-items: center;
      }

      img{
        height:100%;
        width:100%;
        /* height:calc(var(--yourgptChatbotWidgetBtnSize) - 12px);
        width:calc(var(--yourgptChatbotWidgetBtnSize) - 12px); */
        object-fit:contain;
        border-radius: 50%;
      }

      svg{
          height: 70%;
          width: 70%;
          &.chev{
            height: 50%;
            width: 50%;
          }
        }
    }

  

    &-frame {
      z-index: 9999;
      position: fixed;

      ${({ layout }) => (layout.position?.align === "left" ? { left: `var(--yourgptChatbotPositionX)` } : { right: `var(--yourgptChatbotPositionY)` })}
      bottom: calc(var(--yourgptChatbotPositionY) + var(--yourgptChatbotWidgetBtnSize) + 10px);

      height: min(704px, 100% - (100px + var(--yourgptChatbotPositionY)));
      min-height: 80px;
      max-width: 400px;
      width: 100%;
      max-height: 704px;
      background: var(--yourgptChatbotSurfaceColor);
      box-shadow: rgba(0, 0, 0, 0.16) 0px 5px 40px;
      border-radius: 16px;
      overflow: hidden;
      transform-origin: right bottom;
      pointer-events: none;
      transition: max-width 0.3s;
      &.show {
        pointer-events: all;
      }
      &.big {
        max-width: min(800px, 100% - 104px);
      }

      @media (max-width: 500px) {
        bottom: 0;
        left: 0;

        height: 100svh;
        width: 100%;
        max-width: 100%;
        max-height: 100%;
        border-radius: 0;
        box-shadow: none;
      }
    }

    @media (max-width: 500px) {
      &-expander {
        display: none;
      }
    }
  }

  .footerBrand {
    background: hsl(var(--yourgptChatbotTextColorHsl) / 0.04);
  }
`;

export const RootStyles = styled.div`
  &.widgetPlace-showcase {
    .ygpts {
      &-widgetBtnOuter {
        position: absolute;
        right: 0;
        left: unset;
      }
      &-widgetBtn {
      }
      &-frame {
        position: absolute;
        max-width: 100%;
        right: 0;
        left: unset;
      }
      &-welcomePopup {
        position: absolute;
        right: 0;
        left: unset;
      }
    }
  }
`;

import { IconBtn } from "./styles";
import { YOUR_GPT_LAYOUT } from "../utils/constants";
import { useWidget } from "../context/WidgetContext";
import { useState } from "react";
import { usePopper } from "react-popper";
import styled from "styled-components";
import { LanguageCodesE, LanguageLabels } from "../types/layout/lang";
import { AnimatePresence, motion } from "framer-motion";
import ClickAwayListener from "react-click-away-listener";
import { useLanguage } from "../context/LanguageProvider";
import { useIntl } from "react-intl";

export default function LanguagePicker() {
  const { layout } = useWidget();
  const [open, setOpen] = useState(false);
  const { selectLanguage, locale } = useLanguage();
  const intl = useIntl();
  const [search, setSearch] = useState("");

  const [referenceElement, setReferenceElement] = useState<any>(null);
  const [popperElement, setPopperElement] = useState<any>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-end",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 4],
        },
      },
    ],
  });

  if (!layout?.supportedLanguages || layout.supportedLanguages?.length === 0) return null;

  const langList = layout?.supportedLanguages?.filter((l) => {
    const languageKey = l as LanguageCodesE;
    const labelText = LanguageLabels[languageKey];
    return labelText.toLowerCase().includes(search.toLowerCase()) || l.toLowerCase().includes(search.toLowerCase());
  });

  if (layout?.supportedLanguages && layout?.supportedLanguages.length === 1) return null;

  return (
    <>
      <ClickAwayListener
        onClickAway={() => {
          setOpen(false);
        }}
      >
        <Root>
          <IconBtn style={{ position: "relative" }} className="iconbtn" onClick={() => setOpen((s) => !s)} ref={setReferenceElement} color={layout?.colors.textOnPrimary || YOUR_GPT_LAYOUT.colors.textOnPrimary}>
            {/* <LanguagesIcon size={18} /> */}
            <svg viewBox="0 0 512 512" fill="currentColor" height="20" width="20">
              <path d="M478.33 433.6l-90-218a22 22 0 00-40.67 0l-90 218a22 22 0 1040.67 16.79L316.66 406h102.67l18.33 44.39A22 22 0 00458 464a22 22 0 0020.32-30.4zM334.83 362L368 281.65 401.17 362zM267.84 342.92a22 22 0 00-4.89-30.7c-.2-.15-15-11.13-36.49-34.73 39.65-53.68 62.11-114.75 71.27-143.49H330a22 22 0 000-44H214V70a22 22 0 00-44 0v20H54a22 22 0 000 44h197.25c-9.52 26.95-27.05 69.5-53.79 108.36-31.41-41.68-43.08-68.65-43.17-68.87a22 22 0 00-40.58 17c.58 1.38 14.55 34.23 52.86 83.93.92 1.19 1.83 2.35 2.74 3.51-39.24 44.35-77.74 71.86-93.85 80.74a22 22 0 1021.07 38.63c2.16-1.18 48.6-26.89 101.63-85.59 22.52 24.08 38 35.44 38.93 36.1a22 22 0 0030.75-4.9z" />
            </svg>
            <motion.div className="inner" />
          </IconBtn>
          <AnimatePresence>
            {open && (
              <PopupOuter ref={setPopperElement} style={{ ...styles.popper }} {...attributes.popper}>
                <Popup initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}>
                  <div
                    className="popup_inner"
                    style={{
                      insetInlineEnd: "12px",
                    }}
                  />

                  <div className="inputField">
                    <input
                      autoFocus
                      onChange={(e) => setSearch(e.target.value)}
                      value={search}
                      type="search"
                      placeholder={intl.formatMessage({
                        id: "Search",
                        defaultMessage: "Search",
                      })}
                    />
                  </div>

                  <div className="list">
                    {langList?.map((lang) => {
                      return (
                        <div
                          onClick={() => {
                            selectLanguage(lang);
                            setOpen(false);
                          }}
                          key={lang}
                          className={`item ${lang === locale ? "active" : ""}`}
                        >
                          {LanguageLabels[lang]}
                        </div>
                      );
                    })}
                  </div>
                </Popup>
              </PopupOuter>
            )}
          </AnimatePresence>
        </Root>
      </ClickAwayListener>
    </>
  );
}

const Root = styled.div`
  .iconbtn {
    position: relative;

    .inner {
      /* ygpt-absolute ygpt-left-0 ygpt-top-0 ygpt-h-full ygpt-rounded-full ygpt-w-full */
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      border-radius: 50%;
      width: 100%;
    }
  }
`;

const PopupOuter = styled.div`
  z-index: 12;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Popup = styled(motion.div)`
  background: var(--yourgptChatbotSurfaceColor);
  box-shadow: 1px 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  min-width: 120px;
  overflow: auto;
  transform-origin: right top;
  max-height: 320px;
  color: var(--yourgptChatbotTextColor);

  .popup_inner {
    /* ygpt-h-[12px] ygpt-w-[12px] ygpt-rotate-45  ygpt-absolute  ygpt-z-[-1] ygpt-mt-[-4px] ygpt-rounded-[2px] ygpt-inline-block ygpt-aspect-auto ygpt-bg-[var(--yourgptChatbotSurfaceColor)] */
    height: 12px;
    width: 12px;
    transform: rotate(45deg);
    position: absolute;
    z-index: -1;
    margin-top: -4px;
    border-radius: 2px;
    display: inline-block;
    aspect-ratio: auto;
    background: var(--yourgptChatbotSurfaceColor);
  }

  .list {
    display: flex;
    flex-direction: column;
    cursor: pointer;

    .item {
      padding: 8px 12px;
      font-size: 14px;
      transition: all 0.2s;
      &:hover,
      &.active {
        background: hsl(var(--yourgptChatbotTextColorHsl) / 0.1);
      }
    }
  }

  .inputField {
    width: 100%;
    padding: 12px 12px 8px 12px;
    background: var(--yourgptChatbotSurfaceColor);
    position: sticky;
    top: 0;
    backdrop-filter: blur(12px);
    border-radius: 10px;
    overflow: hidden;

    input {
      font-size: 14px;
      background: hsl(var(--yourgptChatbotTextColorHsl) / 0.07);

      padding: 6px 12px;
      border-radius: 6px;
      outline: none;
    }
  }
`;

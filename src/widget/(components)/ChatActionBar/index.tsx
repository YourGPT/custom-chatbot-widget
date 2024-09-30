import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import SendIcon from "../icons/SendIcon";
import { widgetUi } from "../../utils/constants/ui";
import { useWidget } from "../../context/WidgetContext";
// import { useDebounce } from "use-debounce";
import { onMessagePayloadD } from "../../types/message";
// import MediaSender from "./MediaSender";
// import { ChatActionBtnTypes } from "../../types/layout/global";
import { YOUR_GPT_LAYOUT } from "../../utils/constants";
import { useLanguage } from "../../context/LanguageProvider";
import { getTranslatedText, iOS } from "../../utils/helper";
import styled from "styled-components";
import { useChatbot } from "../../context/ChatbotContext";
// import MicIcon from "../icons/MicIcon";
// import AudioRecorder from "./AudioRecorder";

// type Action = ChatActionBtnTypes;

// const actionIcons: Record<Action, JSX.Element> = {
//   image: (
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height={20} width={20}>
//       <path
//         fillRule="evenodd"
//         d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
//         clipRule="evenodd"
//       />
//     </svg>
//   ),
// };

export default function ChatActionBar({ isGenerating, onSend, text: defaultText }: { isGenerating?: boolean; onSend: (d: onMessagePayloadD) => any; text?: string }) {
  const [text, setText] = useState(defaultText?.trim() || "");
  const inputRef = useRef(null as HTMLTextAreaElement | null);
  const interacted = useRef(false);
  const { layout } = useWidget();
  const { locale, defaultLocale } = useLanguage();
  const { execution, setExecution } = useChatbot();

  useEffect(() => {
    setText(defaultText?.trim() || "");
  }, [defaultText]);

  useEffect(() => {
    if (execution?.type === "message:send") {
      if (execution.data.send) {
        onSend({ content_type: "text", message: execution.data.text });
      } else {
        setText(execution.data.text);
      }
      setExecution(null);
    }
  }, [execution, onSend, setExecution]);

  useEffect(() => {
    inputRef.current?.focus({
      preventScroll: true,
    });
  }, []);

  const handleInputChange = (e: any) => {
    interacted.current = true;
    setText(e.target.value);
  };

  // useEffect(() => {
  //   if (interacted.current) {
  //     notifyType(delayText);
  //   }
  // }, [delayText, notifyType]);

  // const onFile = async (e: any) => {
  //   try {
  //     const file = e.target?.files[0];

  //     if (file) {
  //       if (mediaFiles.some((i) => i.name === file?.name)) return;

  //       setMediaFiles((s) => [...s, file]);
  //     }
  //     //reset the file input
  //     e.target.value = "";
  //   } catch (err) {
  //     console.log("Err", err);
  //   }
  // };

  // const handleSendAudio = async (url: string) => {
  //   onSend({ content_type: "audio", url });
  //   setIsRecording(false);
  // };

  return (
    <>
      {/* {mediaFiles.length > 0 && (
        <MediaSender
          files={mediaFiles}
          onCancel={(name) => {
            setMediaFiles((s) => s.filter((i) => i.name !== name));
          }}
          onUpload={(url, name) => {
            onSend({
              content_type: "image",
              url,
            });
            setMediaFiles((s) => s.filter((i) => i.name !== name));
          }}
        />
      )} */}
      <StyledChatActionBar className="action-bar">
        <div className="input-container">
          <TextareaAutosize
            ref={inputRef}
            maxRows={4}
            minRows={1}
            className="textarea"
            value={text}
            onChange={handleInputChange}
            placeholder={getTranslatedText({ defaultLocale, locale, text: layout?.chatbotActionBarSettings?.placeholderText }) || YOUR_GPT_LAYOUT.chatbotActionBarSettings?.placeholderText?.en}
            onKeyDown={(e: any) => {
              if (e.isComposing || e.keyCode === 229 || isGenerating) return;

              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                // if (text.trim().length === 0) return;
                onSend({
                  content_type: "text",
                  message: text,
                });
                setText("");
              }
            }}
          />

          <button
            disabled={isGenerating}
            className={`send-button ${text ? "" : "hidden"}`}
            onClick={() => {
              if (isGenerating) return;
              onSend({
                content_type: "text",
                message: text,
              });
              setText("");
            }}
          >
            <SendIcon size={24} />
          </button>
        </div>

        {/* {setting?.voice?.voice_reply && (
          <>
            {isRecording ? (
              <AudioRecorder onSend={handleSendAudio} onClose={() => setIsRecording(false)} />
            ) : (
              <button disabled={isGenerating} onClick={() => setIsRecording((p) => !p)} className="action-button">
                <MicIcon size={16} />
              </button>
            )}
          </>
        )} */}

        {/* {layout?.chatbotActionBarSettings?.buttons?.map((i, index) => (
          <button disabled={isGenerating} className="action-button" key={index}>
            <label htmlFor={`${i.action}For`} className="cursor-pointer">
              {actionIcons[i.action]}
              {i.action === "image" && <input id={`${i.action}For`} hidden type="file" className="file-input" onChange={onFile} accept="image/gif, image/jpeg, image/png" />}
            </label>
          </button>
        ))} */}
      </StyledChatActionBar>
    </>
  );
}

const StyledChatActionBar = styled.div`
  button {
    all: unset;
  }
  display: flex;
  align-items: center;
  position: relative;
  border-top: 1px solid hsl(var(--yourgptChatbotTextColorHsl) / 0.12);
  color: var(--yourgptChatbotTextColor);
  min-height: ${widgetUi.actionbarHeight}px;

  .input-container {
    position: relative;
    display: flex;
    align-items: center;
    align-self: stretch;
    flex: 1;
  }

  .textarea {
    border: none;
    font-size: ${iOS() ? "16px" : "14px"};
    background: transparent;
    color: inherit;
    resize: none;
    outline: none;
    width: 100%;
    padding: 0.5rem 1rem;
    box-shadow: none;
    min-height: unset;
    text-decoration: none;
    text-transform: none;
    border-radius: 0px;

    &:focus {
      box-shadow: none;
    }
  }

  .send-button {
    z-index: 12;
    cursor: pointer;
    height: 38px;
    width: 38px;
    border-radius: 9999px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    inset-inline-end: 0px;
    transition: all 0.3s ease-in;
    color: var(--yourgptChatbotPrimaryColor);

    &.hidden {
      transform: scale(0.5);
      opacity: 0;
      pointer-events: none;
    }
  }

  .action-button {
    opacity: 0.4;
    position: relative;
    border-radius: 9999px;
    transition: all 0.3s;
    height: 42px;
    width: 42px;
    margin-right: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      opacity: 1;
    }

    &:disabled {
      cursor: not-allowed;
    }
  }

  .file-input {
    all: unset;
    z-index: 12;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
  }
  /* 
  &&&& {
    textarea {
      box-shadow: none;
      min-height: unset;
      background: transparent;
      color: inherit;
      text-decoration: none;
      text-transform: none;
      border-radius: 0px;
      &:focus {
        box-shadow: none;
      }
    }
  } */
`;

import { motion } from "framer-motion";
import styled from "styled-components";

export default function Card({ title, desc, imageUrl, buttons, onAction, actionType }: { title: string; desc?: string; imageUrl: string; buttons: any[]; onAction: (text: string) => any; actionType: "url" | "path" }) {
  return (
    <Root className="">
      {imageUrl && (
        <div className="image">
          <img src={imageUrl} />
        </div>
      )}

      <div className="cardContent">
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>

      {buttons.length > 0 && (
        <div className="btns">
          {buttons.map((i, index) => {
            return (
              <button
                key={index}
                className="btn"
                onClick={() => {
                  if (actionType === "url") {
                    window.open(i.url, "_blank");
                  } else if (actionType === "path") {
                    onAction(i.value);
                  }
                }}
              >
                {i.label}
              </button>
            );
          })}
        </div>
      )}
    </Root>
  );
}

const Root = styled(motion.div)`
  /* min-width: 300px; */
  height: 100%;
  max-width: 320px;
  border-radius: 8px;
  overflow: hidden;
  background: hsl(var(--yourgptChatbotSurfaceColorHsl));
  box-shadow: 2px 2px 6px 0px hsla(var(--yourgptChatbotTextColorHsl) / 0.06);
  border: 1px solid hsla(var(--yourgptChatbotTextColorHsl) / 0.08);
  color: hsl(var(--yourgptChatbotTextColorHsl) / 0.6);
  width: 100%;
  display: flex;
  flex-direction: column;

  img {
    width: 100%;
    aspect-ratio: 16/9;
    object-fit: cover;
  }

  .cardContent {
    padding: 6px 8px;
  }

  h4 {
    font-size: 15px;
    font-weight: 600;
    color: hsl(var(--yourgptChatbotTextColorHsl) / 0.8);
    margin-bottom: 4px;
  }
  p {
    font-size: 14px;
    color: hsl(var(--yourgptChatbotTextColorHsl) / 0.6);
  }

  .btns {
    margin-top: auto;
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    flex-direction: column;
    padding: 12px 12px 12px 12px;
  }

  .btn {
    all: unset;
    padding: 8px 12px;
    background: hsl(var(--yourgptChatbotTextColorHsl) / 0.08);
    color: hsl(var(--yourgptChatbotTextColorHsl) / 0.8);
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:hover {
      background: hsl(var(--yourgptChatbotTextColorHsl) / 0.12);
    }
  }
`;

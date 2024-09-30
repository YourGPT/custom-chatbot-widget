import { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useWidget } from "../context/WidgetContext";
import { DefaultQuestionItemD } from "../types/layout/global";
import { useLanguage } from "../context/LanguageProvider";
import { getTranslatedText } from "../utils/helper";

function Items({ onSend, items, activeItem, onSelect, onBack }: { onSend: (text: string) => void; items: DefaultQuestionItemD[]; activeItem?: DefaultQuestionItemD; onBack?: () => void; onSelect: (item: DefaultQuestionItemD) => void }) {
  const { layout } = useWidget();
  const [questions, setQuestions] = useState<
    {
      question: string;
      label: string;
    }[]
  >([]);

  useEffect(() => {
    if (items) {
      const arr = items || [];
      if (arr && arr?.length > 0) {
        setQuestions(arr.filter((i: any) => i.question || i.label));
      }
    }
  }, [items]);

  if (questions?.length === 0) {
    return null;
  }

  const toRender = (activeItem ? activeItem.children : items)?.filter((i) => i.question || i.label);

  return (
    <ItemsRoot>
      {activeItem && (
        <Item onClick={onBack && onBack} className={`activeItem`}>
          <span className="iconLeft">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height={18} width={18}>
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
          </span>
          {activeItem.label}
        </Item>
      )}
      <Slider className={layout?.defaultQuestionsSetting?.slider ? "slider" : "list"}>
        <div className="list" style={{ marginLeft: activeItem?.question ? 0 : 0 }}>
          {toRender?.map((i, ind) => {
            return (
              <Item
                onClick={() => {
                  if (i.children && i.children?.length > 0) {
                    onSelect(i);
                  } else {
                    onSend(i.question);
                  }
                }}
                className="listItem"
                key={i.id || ind}
              >
                {i.label}
                {/* 
              {(!i.children || i.children.length === 0) && (
                <span className="iconRight">
                  <SendIcon size={16} />
                </span>
              )} */}

                {i.children && i.children?.length > 0 && (
                  <span className="iconRight">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height={18} width={18}>
                      <path fillRule="evenodd" d="M10.21 14.77a.75.75 0 01.02-1.06L14.168 10 10.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M4.21 14.77a.75.75 0 01.02-1.06L8.168 10 4.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                    {/* 
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height={18} width={18}>
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg> */}
                  </span>
                )}
              </Item>
            );
          })}
        </div>
      </Slider>
    </ItemsRoot>
  );
}

export default function DefaultQuestionsChips({ onSend }: { onSend: (text: string) => void }) {
  const { layout } = useWidget();
  const { locale, defaultLocale } = useLanguage();

  const [activeItem, setActiveItem] = useState<DefaultQuestionItemD[]>([...[]]);
  const lastItem = activeItem[activeItem?.length - 1];
  const onBack = () => {
    if (activeItem?.length > 1) {
      setActiveItem((s) => s.slice(0, -1));
    } else {
      setActiveItem([]);
    }
  };
  const questions = getTranslatedText({ defaultLocale, locale, text: layout?.defaultQuestions }) || [];

  if (questions.length === 0) return null;

  return (
    <Items
      onSend={onSend}
      items={activeItem?.length > 0 ? activeItem : questions || []}
      onSelect={(i) => {
        setActiveItem((s) => {
          return [...s, i];
        });
      }}
      activeItem={lastItem}
      onBack={onBack}
    />
  );
}

const ItemsRoot = styled.div`
  /* ygpt-mt-auto ygpt-py-2 ygpt-w-full */
  margin-top: auto;
  padding: 8px 0;
  width: 100%;
`;

const Item = styled(motion.div)`
  background: var(--yourgptChatbotPrimaryColor);
  color: var(--yourgptChatbotTextOnPrimaryColor);
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  transition: all 0.2s;
  border-radius: 120px;
  padding: 8px 14px;
  font-size: 14px;
  cursor: pointer;
  gap: 6px;
  transition: all 0.2s;
  white-space: nowrap;

  .iconLeft,
  .iconRight {
    transition: all 0.2s;
    opacity: 0.6;
  }

  &:hover {
    background: ${(p) => p.color};
    color: var(--yourgptChatbotTextOnPrimaryColor);

    /* transform: translateY(-1px) translateX(1px); */

    .iconLeft {
      opacity: 0.9;
      transform: translateX(-3px);
    }
    .iconRight {
      opacity: 0.9;
      transform: translateX(3px);
    }
  }

  &.activeItem {
    background: rgba(0, 0, 0, 0.02);
    color: rgba(0, 0, 0, 0.7);
    /* ygpt-rounded-full ygpt-transition-all ygpt-cursor-pointer ygpt-opacity-90 hover:ygpt-opacity-100  ygpt-py-1 ygpt-text-sm */
    border-radius: 120px;
    transition: all 0.2s;
    cursor: pointer;
    opacity: 0.9;
    padding-top: 4px;
    padding-bottom: 4px;
    font-size: 14px;

    &:hover {
      opacity: 1;
      background: rgba(0, 0, 0, 0.09);
    }
    /* border: 1px solid; */

    margin-bottom: 12px;
  }
`;

const Slider = styled.div`
  .list {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  &.slider {
    margin-left: -0.5rem;
    padding: 6px 20px 8px 0.5rem;
    margin-bottom: -16px;
    overflow: auto;
    width: calc(100% + 0.8rem);
    &::-webkit-scrollbar {
      background: hsl(var(--yourgptChatbotTextColorHsl) / 0.12);
      height: 12px;
    }
    &::-webkit-scrollbar-track {
    }
    &::-webkit-scrollbar-thumb {
      background: hsl(var(--yourgptChatbotTextColorHsl) / 0.4);
      border-radius: 10px;
    }

    .list {
      flex-wrap: nowrap;
    }
  }
`;

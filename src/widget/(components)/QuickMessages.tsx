import { useChatbot } from "../context/ChatbotContext";
import FollowUpQuestions from "./FollowUpQuestions";
import DefaultQuestionsChips from "./DefaultQuestionsChips";
import { padX } from "../views/compactWidget/(components)/Chatbot";
import { useWidget } from "../context/WidgetContext";

export default function QuickMessages({ sessionUid, onMessage }: { sessionUid?: string; onMessage: (str: string) => any }) {
  const { followUpQuestions } = useChatbot();
  const { layout } = useWidget();

  const followUpQuestionsList = sessionUid ? (followUpQuestions[sessionUid]?.length > 0 ? followUpQuestions[sessionUid] : []) : [];

  return (
    <>
      {followUpQuestionsList.length > 0 ? (
        <FollowUpQuestions
          onSend={(str) => {
            onMessage(str);
          }}
          sesssionUid={sessionUid}
        />
      ) : (
        <>
          {layout?.defaultQuestionsSetting?.slider && (
            <div
              style={{
                position: "sticky",
                bottom: 0,
                marginTop: "auto",
                width: "100%",
              }}
              className={padX}
            >
              <DefaultQuestionsChips
                onSend={(str) => {
                  onMessage(str);
                }}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}

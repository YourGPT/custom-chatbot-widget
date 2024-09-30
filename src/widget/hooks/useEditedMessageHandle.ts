import { useCallback } from "react";
import { EditMessageEventResponse } from "../types/socket";
import { MessageD } from "../types/message";

type PropsD = {
  messages: MessageD[];
  setMessages: (payload: MessageD[]) => void;
};

export const useEditedMessageHandle = ({ messages, setMessages }: PropsD) => {
  const handleMessageEdited = useCallback(
    (data: EditMessageEventResponse) => {
      console.log("data in edit message handle", data);
      return;
      const newS = [...messages];
      const index = newS.findIndex((i) => i.id == data?.id);
      if (index !== -1) {
        newS[index] = {
          ...newS[index],
          message: data?.message,
        };
      }
      setMessages(newS);
    },
    [messages, setMessages]
  );

  return handleMessageEdited;
};

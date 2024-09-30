import { useCallback, useEffect, useMemo, useState } from "react";
import { TriggerItemD } from "../../types/trigger";
import { useChatbot } from "../../context/ChatbotContext";
import { CONDITIONS_KEYS } from "./data";
import { StorageManager } from "../../utils/storage";
import { playSound } from "../../utils/helper";

// const getTimeSpent = () => {
//   return parseInt(sessionStorage.getItem("timeSpent") || "0");
// };

let CAN_REGISTER_TRIGGER = true;
const CAN_TRIGGER_ACTION = {
  openChatbot: true,
  sendMessage: true,
};

const EXECUTED_TRIGGERS: any[] = [];

const sessionExecutedTriggers = sessionStorage.getItem("executedTriggers");
if (sessionExecutedTriggers) {
  EXECUTED_TRIGGERS.push(...JSON.parse(sessionExecutedTriggers));
}

let REGISTERED_TRIGGERS: any[] = [];

let PAGE_TIME_SPENT = 0;

export default function TriggerManager() {
  const [activeTriggers, setActiveTriggers] = useState<TriggerItemD[]>([]);
  const { chatbotSettings, widgetUid, chatbotPopup, setChatbotPopup, setTriggerMessages, sessionCreated } = useChatbot();
  const [pathname, setPathname] = useState<string>(window.location.href);
  const [leftWebsite, setLeftWebsite] = useState<boolean>(false);

  const [hasSessionCreated, setHasSessionCreated] = useState<boolean>(false);

  useEffect(() => {
    const ss = StorageManager.getStorage(widgetUid);
    if (ss?.sessionCreated || sessionCreated) {
      setHasSessionCreated(true);
    }
  }, [sessionCreated, widgetUid]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setLeftWebsite(true);
      } else {
        setLeftWebsite(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const [, setTimeSpent] = useState<number>(0);

  useEffect(() => {
    CAN_REGISTER_TRIGGER = !chatbotPopup || activeTriggers.length > 0;
  }, [chatbotPopup, activeTriggers.length]);

  useEffect(() => {
    if (chatbotPopup) {
      CAN_TRIGGER_ACTION.openChatbot = false;
      CAN_TRIGGER_ACTION.sendMessage = false;
      CAN_REGISTER_TRIGGER = false;
    }
  }, [chatbotPopup]);

  useEffect(() => {
    if (hasSessionCreated) {
      CAN_TRIGGER_ACTION.openChatbot = false;
      CAN_TRIGGER_ACTION.sendMessage = false;
      CAN_REGISTER_TRIGGER = false;
    }
  }, [hasSessionCreated]);

  const visitCount = useMemo(() => {
    if (!chatbotSettings?.widget_uid) return 0;
    const st = StorageManager.getStorage(chatbotSettings?.widget_uid);
    return st?.visitCount || 0;
  }, [chatbotSettings?.widget_uid]);

  useEffect(() => {
    if (chatbotSettings?.chatbot_triggers) {
      const triggers = chatbotSettings.chatbot_triggers.filter((trigger) => trigger.status === "1");
      setActiveTriggers(triggers);
    }
  }, [chatbotSettings?.chatbot_triggers]);

  const executeAction = useCallback((trigger: any) => {
    const action = trigger?.actions;
    if (action.openChatbot && action.openChatbot?.enabled && CAN_TRIGGER_ACTION.openChatbot) {
      setChatbotPopup(true);
      return true;
    }
    if (action.sendMessage && action.sendMessage?.enabled && CAN_TRIGGER_ACTION.sendMessage) {
      setTriggerMessages({
        messages: action.sendMessage?.messages?.en,
        trigger: trigger,
        allowCustomQuestion: action.sendMessage?.allowCustomQuestion,
        questions: action.sendMessage?.buttons?.en,
      });

      if (action.sendMessage?.sound) {
        playSound();
      }

      return true;
    }
    return false;
  }, []);

  const registerWebsiteVisitTrigger = useCallback(
    (trigger: TriggerItemD, registerId: any) => {
      REGISTERED_TRIGGERS.push(registerId);
      console.log("REGISTERED TRIGGER", trigger);

      const data = trigger.data;

      if (!trigger.data) return;

      let timeSpentTm: any;
      //   let timeSpentLocal = 0;

      if (data?.conditions) {
        let conditionValid = false;

        // check for url

        const toCheckPageUrls = data?.conditions[CONDITIONS_KEYS.visitWebsite.pageUrls] || null;
        console.log("TO CHECK PATHANME", pathname, toCheckPageUrls);
        const multipleUrls = toCheckPageUrls && Array.isArray(toCheckPageUrls) && toCheckPageUrls.length > 0 ? true : false;
        if (multipleUrls) {
          const url = pathname;

          if (toCheckPageUrls.includes(url)) {
            conditionValid = true;
            // trigger action
          } else {
            conditionValid = false;
            return;
          }
        } else {
          conditionValid = true;
        }

        //Chek for first visit's condition
        const toCheckFirstVisit = data?.conditions[CONDITIONS_KEYS.visitWebsite.firstVisit] || null;
        if (toCheckFirstVisit) {
          if (visitCount === 0) {
            conditionValid = true;
          } else {
            console.log("FIRST NOT MET");
            conditionValid = false;
            return false;
          }
        }

        //check for returning visit's condition
        // const toCheckReturningVisit = data.conditions[CONDITIONS_KEYS.visitWebsite.returningVisit] || null;
        // if (toCheckReturningVisit) {
        //   if (visitCount > 0) {
        //     conditionValid = true;
        //   } else {
        //     conditionValid = false;
        //     return;
        //   }
        // }

        let scrollConditionMet = true;
        let timeConditionMet = true;

        const triggerAction = () => {
          if (scrollConditionMet && timeConditionMet && REGISTERED_TRIGGERS.includes(registerId)) {
            if (EXECUTED_TRIGGERS.includes(trigger.id)) return;

            const executed = executeAction(data);

            // if (executed && !multipleUrls) { // fo specific everytime visit check
            if (executed) {
              EXECUTED_TRIGGERS.push(trigger.id);
              sessionStorage.setItem("executedTriggers", JSON.stringify(EXECUTED_TRIGGERS));
            }
          }
        };

        //   //check scroll percentage's condition
        const toCheckScrollPercentage = data?.conditions[CONDITIONS_KEYS.visitWebsite.scrolledPercentage] || null;
        const scrollValid = toCheckScrollPercentage !== null && typeof parseInt(toCheckScrollPercentage) === "number" && parseInt(toCheckScrollPercentage) !== 0 ? true : false;
        let scrollActionTriggered = false;
        if (scrollValid) {
          scrollConditionMet = false;
          window.addEventListener(
            "scroll",
            () => {
              const scrollPercentage = Math.round((document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100);
              if (scrollPercentage >= parseInt(toCheckScrollPercentage) && !scrollActionTriggered) {
                scrollConditionMet = true;
                scrollActionTriggered = true;
                triggerAction();
              }
            },
            true
          );
        }
        //check for time spent's condition
        const toCheckTimeSpent = data?.conditions[CONDITIONS_KEYS.visitWebsite.timeSpent] || null;
        const timeSpentValid = toCheckTimeSpent !== null && typeof parseInt(toCheckTimeSpent) === "number" ? true : false;
        if (timeSpentValid) {
          timeConditionMet = false;

          if (timeSpentTm) clearInterval(timeSpentTm);
          timeSpentTm = setInterval(() => {
            const difference = parseInt(toCheckTimeSpent) - PAGE_TIME_SPENT;
            if (difference <= 0) {
              clearInterval(timeSpentTm);
              timeConditionMet = true;
              triggerAction();
            }
          }, 1000);
        }

        /**
         *
         */
        if (scrollConditionMet && timeConditionMet && conditionValid) {
          triggerAction();
        }
      }

      return () => {
        if (timeSpentTm) clearInterval(timeSpentTm);
      };
    },
    [visitCount, pathname, executeAction]
  );

  /**
   * TIME SPEND
   */
  useEffect(() => {
    const tm = setInterval(() => {
      setTimeSpent((s) => {
        const newValue = s + 1;
        sessionStorage.setItem("timeSpent", newValue.toString());
        return newValue;
      });
    }, 1000);

    return () => {
      clearInterval(tm);
    };
  }, []);

  useEffect(() => {
    // CAN_TRIGGER_ACTION.sendMessage = true;
    // CAN_TRIGGER_ACTION.openChatbot = true;
    // CAN_REGISTER_TRIGGER = true;

    const tm = setInterval(() => {
      PAGE_TIME_SPENT = PAGE_TIME_SPENT + 1;
    }, 1000);

    return () => {
      PAGE_TIME_SPENT = 0;
      clearInterval(tm);
    };
  }, [pathname]);

  /**
   * PATH AN ROUTES CHANGES
   */

  useEffect(() => {
    let previousUrl = "";
    const observer = new MutationObserver(function () {
      if (location.href !== previousUrl) {
        previousUrl = location.href;
        setPathname(location.href);
      }
    });
    const config = { subtree: true, childList: true };
    observer.observe(document, config);
  });

  /**
   * REGISTERING TRIGGERS
   */

  const clearRegisteredTriggers = useCallback((id?: any) => {
    if (id) {
      REGISTERED_TRIGGERS = REGISTERED_TRIGGERS.filter((rId) => rId !== id);
    } else {
      REGISTERED_TRIGGERS = [];
    }
  }, []);

  // VISIT TRIGGER
  useEffect(() => {
    //REGISTERED TRIGGER
    const registeredTriggers: any[] = [];
    const nonExecutedTriggers = activeTriggers.filter((i) => !EXECUTED_TRIGGERS.includes(i.id));
    const proceedWithTrigger = (trigger: TriggerItemD) => {
      const rId = `${trigger.id}-${Date.now()}`;
      registeredTriggers.push(rId);
      registerWebsiteVisitTrigger(trigger, rId);
    };

    if (CAN_REGISTER_TRIGGER && nonExecutedTriggers.length > 0) {
      //VISIT TERIGGERS
      const visitTriggers = nonExecutedTriggers.filter((i) => i.data?.event === "visitWebsite");
      if (visitTriggers && visitTriggers.length > 0) {
        const thisPathTrigger = visitTriggers.find((i) => i.data?.conditions.pageUrls?.includes(pathname));
        const globalTrigger = visitTriggers.filter((i) => !i.data?.conditions.pageUrls || i.data?.conditions.pageUrls.length === 0);

        if (thisPathTrigger) {
          //THIS PAGE VISIT
          //CLEAR OTHER PAGE VISIT TRIGGERS
          clearRegisteredTriggers();
          //REGISTER TRIGGER
          proceedWithTrigger(thisPathTrigger);
        } else {
          //REGISTER ALL OTHER TRIGGERS
          globalTrigger.forEach((i) => {
            if (
              REGISTERED_TRIGGERS.some((i2) => {
                const [id] = i2.split("-");
                return id?.toString() === i.id?.toString();
              })
            ) {
              //Trigger already registered
              return;
            }
            proceedWithTrigger(i);
          });
        }
      }
    }

    return () => {};
  }, [activeTriggers, pathname, registerWebsiteVisitTrigger, clearRegisteredTriggers]);

  //CLICK ELEMENT TRIGGER
  useEffect(() => {
    // Step 1: Define a Map to hold element and its corresponding event listener function
    const eventListenersMap = new Map();

    const delayIdMap: any = {};

    const clickElementTriggers = activeTriggers.filter((i) => i.data?.event === "clickElement");

    if (clickElementTriggers.length > 0) {
      clickElementTriggers.forEach((trigger) => {
        const data = trigger.data;
        if (!data) return;
        const selectors = data?.conditions?.elementSelectors || [];

        selectors.forEach((selector: string) => {
          const element = document.querySelector(selector);
          if (element) {
            const isAlreadyExecuted = () => EXECUTED_TRIGGERS.includes(trigger.id);
            if (isAlreadyExecuted()) return;

            // Define the event listener function
            const eventListener = () => {
              if (isAlreadyExecuted()) {
                clearTimeout(delayIdMap[selector]);
                return;
              }

              const delay = parseInt(data?.conditions?.delay || 0);
              if (delayIdMap[selector]) {
                clearTimeout(delayIdMap[selector]);
              }
              delayIdMap[selector] = setTimeout(() => {
                const executed = executeAction(data);
                if (executed) {
                  EXECUTED_TRIGGERS.push(trigger.id);
                  sessionStorage.setItem("executedTriggers", JSON.stringify(EXECUTED_TRIGGERS));
                }
              }, delay * 1000);
            };

            // Step 2: Add event listener and store the function reference
            element.addEventListener("click", eventListener);
            eventListenersMap.set(element, eventListener);
          } else {
            //clear the timeout if the element is not found specifically
            if (delayIdMap[selector]) {
              clearTimeout(delayIdMap[selector]);
            }
          }
        });
      });
    }

    // Step 3: Cleanup function to remove event listeners
    return () => {
      eventListenersMap.forEach((listener, element) => {
        element.removeEventListener("click", listener);
      });
      // Step 4: Clear the Map
      eventListenersMap.clear();
    };
  }, [pathname, activeTriggers]);

  /**
   * LEAVE WEBSITE TRIGGER
   *
   */

  useEffect(() => {
    let tm: any;
    const leaveWebsiteTriggers = activeTriggers.filter((i) => i.data?.event === "leaveWebsite");
    if (leaveWebsiteTriggers.length > 0) {
      const leaveWebsiteTrigger = leaveWebsiteTriggers[0];
      const data = leaveWebsiteTrigger.data;
      if (!data) return;

      const delay = parseInt(data?.conditions?.delay || 0);
      if (leftWebsite) {
        tm = setTimeout(() => {
          const executed = executeAction(data);
          if (executed) {
            EXECUTED_TRIGGERS.push(leaveWebsiteTrigger.id);
            sessionStorage.setItem("executedTriggers", JSON.stringify(EXECUTED_TRIGGERS));
          }
        }, delay * 1000);
      } else {
        if (tm) clearTimeout(tm);
      }
    }

    return () => {
      if (tm) clearTimeout(tm);
    };
  }, [leftWebsite, activeTriggers, executeAction]);

  return <></>;
}

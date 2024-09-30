import { parseStreamString } from "./helper";
// import * as Sentry from "@sentry/react";

export const getStreamData = ({
  url,
  token,
  onUpdate,
  sessionUid,
}: {
  url: string;
  onUpdate: (d: { res: string; error?: string; finished?: boolean; messageId?: string; links?: any[]; sessionUid: any }) => void;
  token?: string;
  sessionUid: any;
}) => {
  let response = "";
  const RETRY_LIMIT = 3;
  let retryCount = 0;
  const ERROR_RETRY_DELAY = 5000;
  const NO_RESPONSE_WAIT_TIME = 12000;

  const errorMessage = "Unable to process your request at the moment. Please try again.";

  //NO RES
  let timeoutId: any = null;
  let controller: AbortController | null = null;

  const connectToStream = () => {
    try {
      /**
       * FETCH API
       */
      controller = new AbortController(); // create a new AbortController
      timeoutId = setTimeout(() => {
        // start the timeout
        if (controller) {
          controller.abort(); // cancel the previous request
        }
      }, NO_RESPONSE_WAIT_TIME); // wait for 12 seconds

      const StreamD = {
        onListen: (event: any, data: any) => {
          switch (event) {
            case "response":
              if (data && data.id && response.trim()) {
                onUpdate({
                  res: response,
                  messageId: data.id,
                  sessionUid: sessionUid,
                });
              }
              break;
            case "learnMoreLinks":
              if (data && data?.length > 0) {
                onUpdate({
                  links: data,
                  res: response,
                  sessionUid: sessionUid,
                });
              }
              break;
            case "RXERROR":
              if (data) {
                onUpdate({
                  error: "Error",
                  finished: true,
                  res: response,
                  sessionUid: sessionUid,
                });
              }
              break;
            case "end":
              if (response.trim()) {
                onUpdate({
                  res: response,
                  sessionUid: sessionUid,
                  finished: true,
                });
              } else {
                //FLOW DETECTED  SO NO RETRY
                // if (retryCount <= RETRY_LIMIT) {
                //   retryCount = retryCount + 1;
                //   connectToStream();
                // }
              }
              break;
            default:
              if (data && typeof data === "string") {
                response = response + data;
                response = parseStreamString(response);
                onUpdate({
                  res: response,
                  sessionUid: sessionUid,
                });
              }
          }
        },
      };

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          token,
        }),
      })
        .then((response) => {
          clearTimeout(timeoutId); // clear the timeout
          if (response.status !== 200) {
            response.json().then((data) => {
              if (data.error) {
                if (data.error.includes("Unexpected Response: 404 (Not Found)")) {
                  // Sentry.captureException(data.error);
                  onUpdate({
                    error: "Error",
                    finished: true,
                    res: "Please train your chatbot first.",
                    sessionUid: sessionUid,
                  });
                } else {
                  // Sentry.captureException("STREAM ERROR: " + data.error);

                  if (retryCount <= RETRY_LIMIT) {
                    retryCount = retryCount + 1;
                    setTimeout(connectToStream, ERROR_RETRY_DELAY);
                  } else {
                    onUpdate({
                      error: "Error",
                      finished: true,
                      res: errorMessage,
                      sessionUid: sessionUid,
                    });
                  }
                }
              }
            });

            return;
          } else {
            if (!response.body) {
              return;
            }
            const reader = response.body.getReader();

            // Handle the text stream
            const handleStream = async () => {
              const decoder = new TextDecoder("utf-8");

              // let maxIterations = 10000;

              outerLoop: while (true) {
                // if (--maxIterations <= 0) break outerLoop;
                const { value, done } = await reader.read();

                if (done) {
                  break outerLoop;
                }

                const chunkText = decoder.decode(value, { stream: true });

                const splits = chunkText.split("\n\n");

                for (let i = 0; i < splits.length; i++) {
                  const split = splits[i];
                  try {
                    const parsed = JSON.parse(split.replace("data:", ""));
                    if (parsed && parsed.event) {
                      StreamD.onListen(parsed.event, parsed.data);
                      if (parsed.event === "end") {
                        reader.cancel();
                        break outerLoop;
                      }
                    }
                  } catch (err) {
                    // console.log("ERRR", split);
                    // console.log(err);
                  }
                }
              }
            };

            handleStream();
          }
        })
        .catch((error) => {
          // Handle fetch errors
          console.error("Fetch error:", error);
          // Sentry.captureException("STREAM API ERROR: ");

          if (retryCount <= RETRY_LIMIT) {
            retryCount = retryCount + 1;
            setTimeout(connectToStream, ERROR_RETRY_DELAY);
          } else {
            onUpdate({
              error: "Error",
              finished: true,
              res: errorMessage,
              sessionUid: sessionUid,
            });
          }
        });
    } catch (err) {
      console.log(err, "getStreamData err");

      if (retryCount <= RETRY_LIMIT) {
        retryCount = retryCount + 1;
        setTimeout(connectToStream, ERROR_RETRY_DELAY);
      } else {
        onUpdate({
          error: "Error",
          finished: true,
          res: errorMessage,
          sessionUid: sessionUid,
        });
      }
    }
  };

  connectToStream();
};

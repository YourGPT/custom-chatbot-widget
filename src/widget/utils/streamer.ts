import { parseStreamString } from "./helper";

export const errorMessage = "Unable to process your request at the moment. Please try again.";

export async function handleStream({
  data,
  setGenerating,
  getFollowUps,
  setThinking,
  onUpdate,
}: {
  data: any;
  setGenerating: any;
  getFollowUps: (msgId: string) => void;
  setThinking: (payload: any) => void;
  onUpdate: (payload: { text: string; messageId?: string; finished?: boolean }) => void;
}) {
  if (data.stream && data?.stream_url) {
    // Initially show loading until we receive first chunk
    setThinking("loading");

    let messageId: null | number = null;
    getStreamData({
      url: data.stream_url,
      token: data.stream_token,
      setGenerating,
      onUpdate: (res: any) => {
        // Keep "loading" until non-empty text is received, then switch to "streaming". Clear on finish.
        if (res.finished) {
          setThinking(null);
        } else if (res.res && String(res.res).trim().length > 0) {
          setThinking("streaming");
        } else {
          setThinking("loading");
        }

        if (res.messageId) {
          messageId = res.messageId;
          getFollowUps(messageId!.toString());
        }

        onUpdate({
          text: res.res,
          messageId: messageId ? String(messageId) : undefined,
          finished: !!res.finished,
        });
      },
    });
  }
}

enum StreamEvents {
  RESPONSE = "response",
  // LEARN_MORE_LINKS = "learnMoreLinks",
  RXERROR = "RXERROR",
  END = "end",
}

export const getStreamData = async ({
  url,
  token,
  onUpdate,
  setGenerating,
}: {
  url: string;
  onUpdate: (d: { res: string; error?: string; finished?: boolean; messageId?: string; links?: any[]; case?: string }) => void;
  token?: string;

  setGenerating: any;
}) => {
  let response = "";
  const RETRY_LIMIT = 3;
  let retryCount = 0;

  const ERROR_RETRY_DELAY = 5000;
  const NO_RESPONSE_WAIT_TIME = 12000;

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

      // setGenerating(true);

      const StreamD = {
        onListen: (event: any, data: any) => {
          switch (event) {
            case StreamEvents.RESPONSE:
              // Newer format: data is an object { message: string, id?: string | null }
              if (data && typeof data === "object" && ("message" in data || "id" in data)) {
                response = String(data?.message ?? "");
                onUpdate({
                  res: response,
                  messageId: data?.id ?? undefined,
                });
              } else if (typeof data === "string") {
                // Legacy format: raw string chunks
                response = response + data;
                response = parseStreamString(response);
                onUpdate({
                  res: response,
                });
              }
              break;
            // case StreamEvents.LEARN_MORE_LINKS:
            //   console.log("learnMoreLinks", data);
            //   if (data && data?.length > 0) {
            //     onUpdate({
            //       links: data,
            //       res: response,
            //       case: StreamEvents.LEARN_MORE_LINKS,
            //     });
            //   }
            //   break;
            case StreamEvents.RXERROR:
              if (data) {
                onUpdate({
                  error: "Error",
                  finished: true,
                  res: response,
                });
              }
              break;
            case StreamEvents.END:
              if (response.trim()) {
                onUpdate({
                  res: response,
                  finished: true,
                });
                setGenerating(false);
              } else {
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
                });
              }
          }
        },
      };

      fetch(url, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          token,
        }),
      })
        .then((response) => {
          clearTimeout(timeoutId); // clear the timeout

          if (!response.body) {
            return;
          }
          const reader = response.body.getReader();

          // Handle the text stream
          const handleStream = async () => {
            const decoder = new TextDecoder("utf-8");

            // let maxIterations = 10000;
            const True = true;

            outerLoop: while (True) {
              // if (--maxIterations <= 0) break outerLoop;
              // const { value } = await reader.read();

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

          // setGenerating(false);
        })
        .catch((error) => {
          // Handle fetch errors
          console.error("Fetch error:", error);
          // setGenerating(false);

          if (retryCount <= RETRY_LIMIT) {
            retryCount = retryCount + 1;
            console.log("Retrying... fetch error");
            setTimeout(connectToStream, ERROR_RETRY_DELAY);
          } else {
            onUpdate({
              error: "Error",
              finished: true,
              res: errorMessage,
            });
          }
        });

      // setGenerating(false);

      return;
    } catch (err) {
      // setGenerating(false);

      console.log(err, "getStreamData err");
      if (retryCount <= RETRY_LIMIT) {
        retryCount = retryCount + 1;
        console.log("Retrying..., catch error");
        setTimeout(connectToStream, ERROR_RETRY_DELAY);
      } else {
        onUpdate({
          error: "Error",
          finished: true,
          res: errorMessage,
        });
      }
    }
  };

  connectToStream();
};

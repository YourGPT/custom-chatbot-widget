import { parseStreamString } from "./helper";

export const errorMessage = "Unable to process your request at the moment. Please try again.";

export async function handleStream({ data, messages, setMessages, setGenerating, getFollowUps, setThinking }) {
  if (data.stream && data?.stream_url) {
    setThinking(true);

    // const streamIndex = messages.length + 1;

    const streamIndex = messages.length;

    const newMessages = [
      ...messages,
      {
        ...data,
        loadingStatus: "loading",
        localId: Date.now(),
        send_by: "assistant",
        stream: true,
        createdAt: null,
        message: "",
      },
    ];

    setMessages(newMessages);

    let messageId: null | number = null;
    getStreamData({
      url: data.stream_url,
      token: data.stream_token,
      setGenerating,
      onUpdate: (res: any) => {
        setThinking(false);
        if (res.messageId) {
          messageId = res.messageId;
          getFollowUps(messageId!.toString());
        }

        const updatedMessages = [...newMessages];

        updatedMessages[streamIndex] = {
          ...updatedMessages[streamIndex],
          loadingStatus: res.finished ? null : "streaming",
          message: res.res,
          id: Number(messageId || -1) || updatedMessages[streamIndex].message_id || 0,
          createdAt: res.finished ? Date.now() : null,
          // links: res?.links || updatedMessages[streamIndex]?.links || [],
          // ...(res?.links && res?.case === StreamEvents.LEARN_MORE_LINKS && showLearnMores && { links: res?.links }),
        };

        if (updatedMessages[streamIndex].loadingStatus === "loading" || updatedMessages[streamIndex].loadingStatus === "streaming") {
          setGenerating(true);
        } else if (res?.finished || updatedMessages[streamIndex].loadingStatus === null) {
          setGenerating(false);
        }

        setMessages(updatedMessages);
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
              if (data && data.id && response.trim()) {
                onUpdate({
                  res: response,
                  messageId: data.id,
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

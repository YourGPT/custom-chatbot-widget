import { marked } from "marked";
import styled from "styled-components";
import YoutubePlayer from "../YoutubePlayer";
import VideoPlayer from "../VideoPlayer";
import AudioPlayer from "../AudioPlayer";
import sanitizeHtml from "sanitize-html";

export default function MDText({ text, raw = false }: { text: string; raw?: boolean }) {
  // const imageLinkRegex = /(https?:\/\/.*\.(?:jpg|jpeg|png|bmp|tiff|webp|svg|ico))/i;
  // const gifLinkRegex = /(https?:\/\/.*\.gif)/i;
  const youtubeVideoRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/;
  const audioLinkRegex = /https?:\/\/.*\.(mp3|ogg|wav|flac|aac)/i;
  const videoLinkRegex = /https?:\/\/.*\.(mp4|avi|mkv|wmv|mov|mpg|flv|webm)/i;

  // const imageLinkMatch = text.match(imageLinkRegex);
  // const gifLinkMatch = text.match(gifLinkRegex);
  const youtubeVideoMatch = text.match(youtubeVideoRegex);
  const audioLinkMatch = text.match(audioLinkRegex);
  const videoLinkMatch = text.match(videoLinkRegex);

  const cleanText = `${sanitizeHtml(text)}`;

  const renderer = new marked.Renderer();

  const linkRenderer = renderer.link;
  renderer.link = (href, title, text) => {
    const html = linkRenderer.call(renderer, href, title, text);
    return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
  };

  if (raw) {
    return (
      <ParseToHtml
        dangerouslySetInnerHTML={{
          __html: marked.parse(cleanText, {
            breaks: true,
            renderer,
          }),
        }}
      />
    );
  }

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <ParseToHtml
        dangerouslySetInnerHTML={{
          __html: marked.parse(cleanText, {
            breaks: true,
            renderer,
          }),
        }}
      />

      {/* {imageLinkMatch && <ImageViewer src={imageLinkMatch[0]} />} */}
      {/* {gifLinkMatch && <ImageViewer src={gifLinkMatch[0]} />} */}
      {youtubeVideoMatch && <YoutubePlayer src={youtubeVideoMatch[0]} />}
      {videoLinkMatch && <VideoPlayer src={videoLinkMatch[0]} />}
      {audioLinkMatch && <AudioPlayer src={audioLinkMatch[0]} />}
    </div>
  );
}

const ParseToHtml = styled.span`
  && {
    * {
      /* font-weight: normal; */
      word-break: break-word;
      /* overflow-wrap: break-word; */
      /* white-space: pre-wrap; */
    }

    a {
      text-decoration: underline;
    }

    h1 {
      font-size: 36px;
    }
    h2 {
      font-size: 30px;
    }
    h3 {
      font-size: 24px;
    }
    h4 {
      font-size: 20px;
    }
    h5 {
      font-size: 18px;
    }
    h6 {
      font-size: 16px;
    }
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p {
      padding: 5px 0;
      font-size: 14px;
      line-height: 1.4;
    }
    .parse-to-html {
      white-space: pre-line;
    }
    /* ============= table style =================== */
    table {
      border-collapse: collapse;
      border: none;
      display: block;
      overflow-x: auto;
      white-space: nowrap;
      padding: 3px 0;
      font-size: 14px;
      border-radius: 6px;
      overflow: hidden;
      color: var(--yourgptChatbotTextColor);

      ::-webkit-scrollbar {
        height: 4px;
      }
      ::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb {
        background: #ccc8c8;
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #777;
      }
      thead {
        /* background-color: hsl(var(--yourgptChatbotTextColorHsl) / 0.1); */
      }
      th,
      td {
        padding: 8px;
        white-space: nowrap;
        font-size: 13px;
      }
      th {
        font-weight: bold;
      }
      tr {
        /* background-color: hsl(var(--yourgptChatbotTextColorHsl) / 0.1); */
        &:not(:last-child) {
          border-bottom: 1px solid;
          border-color: hsl(var(--yourgptChatbotTextColorHsl) / 0.16);
        }
      }
      /* Style table rows */
      tr:nth-child(even) {
        /* background-color: hsl(var(--yourgptChatbotTextColorHsl) / 0.05); */
      }
    }

    /* =============== pre and code tag style ============= */
    pre {
      color: var(--yourgptChatbotTextColor);
      padding: 10px;
      border-radius: 10px;
      line-height: 1.2;
    }
    code {
      white-space: normal;
      font-family: "Source Code Pro", monospace;
      background: hsl(var(--yourgptChatbotTextColorHsl) / 0.1);
      border-radius: 4px;
      font-size: 14px;
      padding: 0px 4px;
    }

    /* ============= list style =================== */
    ul {
      list-style-type: disc;
      padding-inline-start: 20px;
      list-style-type: disc;
      font-size: inherit;
      font-size: inherit;

      li {
        padding: 3px 0;
      }
    }

    li {
      font-size: inherit;
      display: list-item;
      margin-top: 0px;
      margin-bottom: 0px;
      min-height: unset;
      font-size: inherit !important;
      line-height: inherit !important;
      &::before,
      &::after {
        display: none;
      }
    }

    ol {
      list-style-type: decimal;
      padding-inline-start: 20px;
      font-size: 14px;

      li {
        padding: 3px 0;
      }
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 5px;
      max-height: 250px;
      margin-bottom: 10px;
      margin-top: 10px;
    }

    /* ========================================== */
    blockquote p {
      border-left: 3px solid rgb(160, 170, 191);
      padding-left: 10px;
      margin: 5px 0;
    }
  }
`;

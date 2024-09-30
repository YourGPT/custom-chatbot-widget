import React from "react";
import styled from "styled-components";

interface YoutubePlayerProps {
  src: string;
}

const YoutubePlayer: React.FC<YoutubePlayerProps> = ({ src }) => {
  const ytRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/;
  const match = src.match(ytRegex);

  const videoId = match ? match[1] : "";
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <VideoPlayerContainer>
      <VideoPlayerIframe src={youtubeEmbedUrl} title="YouTube Video" allowFullScreen />
    </VideoPlayerContainer>
  );
};

export default YoutubePlayer;

const VideoPlayerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding-bottom: 56.25%;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 10px;
`;

const VideoPlayerIframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

import React from "react";
import styled from "styled-components";

interface VideoPlayerProps {
  src: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  return (
    <VideoPlayerContainer>
      <video controls width="100%">
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </VideoPlayerContainer>
  );
};

export default VideoPlayer;

const VideoPlayerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 10px;
`;

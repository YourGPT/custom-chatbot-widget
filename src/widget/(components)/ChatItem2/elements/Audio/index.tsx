import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface AudioMessageProps {
  src: string;
}

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const AudioMessage: React.FC<AudioMessageProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const duration = audioRef.current?.duration;

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("timeupdate", () => {
        setCurrentTime(audio.currentTime);
        if (audio.currentTime === audio.duration) {
          setIsPlaying(false);
        }
      });
    }
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const seekTime = (event: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressBarRef.current;
    if (audio && progressBar) {
      const percent = (event.nativeEvent.offsetX / progressBar.offsetWidth) * 100;
      audio.currentTime = (percent * audio.duration) / 100;
    }
  };

  return (
    <AudioContainer>
      <audio ref={audioRef} src={src} />
      <PlayPauseButton onClick={togglePlayPause}>
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" height={16} width={16}>
            <path
              fillRule="evenodd"
              d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" height={16} width={16}>
            <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
          </svg>
        )}
      </PlayPauseButton>

      <TimeContainer>
        <ProgressBar ref={progressBarRef} onClick={seekTime} onMouseDown={handleDragStart} onMouseUp={handleDragEnd} onMouseMove={isDragging ? seekTime : undefined}>
          <Progress style={{ width: duration && duration !== Infinity ? `${(currentTime / duration ?? currentTime) * 100}%` : `${currentTime * 10}%` }} />
        </ProgressBar>
        <CurrentTime>{formatTime(currentTime)}</CurrentTime>
        {Number(duration) > 0 && duration !== Infinity && <Duration>{formatTime(duration || currentTime)}</Duration>}
      </TimeContainer>
    </AudioContainer>
  );
};

const AudioContainer = styled.div`
  display: flex;
  align-items: center;
  background: var(--yourgptChatbotUserMessageBgColor);
  color: var(--yourgptChatbotUserMessageTextColor);
  border-radius: 12px;
  border-bottom-right-radius: 4px;
  & * {
    color: var(--yourgptChatbotUserMessageTextColor);
  }
  width: fit-content;
  max-width: 560px;
  position: relative;
  padding: 12px;
  margin-right: 10px;
`;

const PlayPauseButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--yourgptChatbotBotMessageBgColor);
  color: #fff;
  border-radius: 9999px;
  transition: background-color 300ms, border-color 300ms, color 300ms, fill 300ms, stroke 300ms;
  margin-right: 0.65rem;

  &:hover {
    opacity: 0.9;
  }

  &:focus {
    outline: 2px solid hsl(var(--yourgptChatbotPrimaryColorHsl) / 0.4);
  }
`;

const TimeContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const CurrentTime = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: var(--yourgptChatbotUserMessageTextColor);
  opacity: 60%;
  width: 30px;
  position: absolute;
  left: 0;
  top: 120%;
`;

const Duration = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: var(--yourgptChatbotUserMessageTextColor);
  opacity: 60%;
  width: 30px;
  position: absolute;
  right: 0;
  top: 120%;
`;

const ProgressBar = styled.div`
  height: 0.4rem;
  background-color: hsl(var(--yourgptChatbotTextColorHsl) / 0.2);
  box-shadow: inset 0 1px 2px hsl(var(--yourgptChatbotTextColorHsl) / 0.2);
  border-radius: 9999px;
  overflow: hidden;
  width: 100px;
  cursor: pointer;
  min-width: 200px;
`;

const Progress = styled.div`
  height: 100%;
  background-color: var(--yourgptChatbotBotMessageBgColor);
  transition: all 0.3s ease;
`;

export default AudioMessage;

import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import styled from "styled-components";

const AudioPlayerContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--yourgptChatbotSurfaceColor);
  background-color: transparent;
  padding: 5px;
  border-radius: 100px;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 5px;
  background-color: rgba(0, 0, 0, 0.3);
  position: relative;
  cursor: pointer;
  border-radius: 5px;
  overflow: hidden;
  min-width: 140px;
`;

const Progress = styled.div<{ width: number }>`
  border-radius: 5px;
  height: 100%;
  width: ${(props) => props.width}%;
  background-color: #fff;
`;

const PlayPauseButton = styled.button`
  color: #333;
  border: none;
  cursor: pointer;
  margin-right: 10px;
  font-size: 20px;
  background-color: #f5f5f5;
  height: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TimeDisplay = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-left: 10px;
  /* background-color: red; */
  width: 70px;
`;

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const currentAudio = audioRef.current;

    if (currentAudio) {
      currentAudio.addEventListener("ended", () => {
        setIsPlaying(false);
      });

      currentAudio.addEventListener("timeupdate", () => {
        if (!isDragging) {
          setCurrentTime(currentAudio.currentTime);
        }
        setDuration(currentAudio.duration);
      });
    }

    return () => {
      if (currentAudio) {
        currentAudio.removeEventListener("ended", () => {
          setIsPlaying(false);
        });
        currentAudio.removeEventListener("timeupdate", () => {
          if (!isDragging) {
            setCurrentTime(currentAudio.currentTime);
          }
          setDuration(currentAudio.duration);
        });
      }
    };
  }, [audioRef, isDragging]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent) => {
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const progressBarWidth = progressBarRef.current.offsetWidth;
    const newTime = (offsetX / progressBarWidth) * duration;

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const progressBarWidth = progressBarRef.current.offsetWidth;
      const newTime = (offsetX / progressBarWidth) * duration;

      if (audioRef.current) {
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <AudioPlayerContainer>
      <PlayPauseButton onClick={togglePlay}>{isPlaying ? <FaPause /> : <FaPlay />}</PlayPauseButton>

      <ProgressBar ref={progressBarRef} onClick={handleProgressBarClick} onMouseDown={handleMouseDown}>
        <Progress width={(currentTime / duration) * 100} />
      </ProgressBar>
      <TimeDisplay>
        {formatTime(currentTime)} / {formatTime(duration)}
      </TimeDisplay>

      <audio src={src} ref={audioRef}></audio>
    </AudioPlayerContainer>
  );
};

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainderSeconds < 10 ? "0" : ""}${remainderSeconds}`;
}

export default AudioPlayer;

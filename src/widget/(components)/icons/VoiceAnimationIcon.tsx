import styled, { keyframes } from "styled-components";

export default function VoiceAnimationIcon({ size, color }: { size: number; color?: string }) {
  return (
    <VoiceIcon height={size} width={size} viewBox="0 0 24 24" fill="none" stroke={color ?? "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 10v3" />
      <path d="M6 6v11" />
      <path d="M10 3v18" />
      <path d="M14 8v7" />
      <path d="M18 5v13" />
      <path d="M22 10v3" />
    </VoiceIcon>
  );
}

const voiceAnimation = keyframes`
  0% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.7);
  }
  100% {
    transform: scaleY(1);
  }
`;

const VoiceIcon = styled.svg`
  path {
    transform-origin: center bottom;
    animation: ${voiceAnimation} 800ms infinite alternate;

    &:nth-child(1) {
      animation-delay: 0s;
    }
    &:nth-child(2) {
      animation-delay: 0.1s;
    }
    &:nth-child(3) {
      animation-delay: 0.2s;
    }
    &:nth-child(4) {
      animation-delay: 0.2s;
    }
    &:nth-child(5) {
      animation-delay: 0.3s;
    }
    &:nth-child(6) {
      animation-delay: 0.4s;
    }
  }
`;

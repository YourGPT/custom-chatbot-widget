import styled, { keyframes } from "styled-components";

const LoadingDots = () => {
  return (
    <WaveLoader>
      <span style={{ animationDelay: "0s" }} />
      <span style={{ animationDelay: "0.2s" }} />
      <span style={{ animationDelay: "0.4s" }} />
    </WaveLoader>
  );
};

export default LoadingDots;

const waveAnimation = keyframes`
  0%, 100% {
    opacity: 1;
    transform: translateY(8);
  }
  /* 25% {
    transform: translateY(-10px);
  }
  55% {
    transform: translateY(10px);
  } */
 65% {
    opacity: 0.5;
    transform: translateY(-8px);
  }
`;

const WaveLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  gap: 4px;
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 8px;

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: currentColor;
    animation: ${waveAnimation} 0.8s ease-in-out infinite;
  }
`;

import React, { useState } from "react";
import styled from "styled-components";

const TooltipContainer = styled.div<{ placement: string; visible: boolean }>`
  position: relative;
  display: inline-block;

  .tooltip {
    position: absolute;
    background-color: #333;
    color: #fff;
    padding: 5px;
    border-radius: 5px;
    opacity: ${(props) => (props.visible ? "1" : "0")};
    transition: opacity 0.3s;

    ${(props) => {
      // Adjust tooltip position based on placement prop
      switch (props.placement) {
        case "top":
          return "bottom: 100%; left: 50%; transform: translateX(-50%);";
        case "bottom":
          return "top: 100%; left: 50%; transform: translateX(-50%);";
        case "left":
          return "top: 50%; right: 100%; transform: translateY(-50%);";
        case "right":
          return "top: 50%; left: 100%; transform: translateY(-50%);";
        default:
          return "bottom: 100%; left: 50%; transform: translateX(-50%);";
      }
    }}
  }

  .arrow {
    position: absolute;
    width: 0;
    height: 0;

    ${(props) => {
      // Adjust arrow position based on placement prop
      switch (props.placement) {
        case "top":
          return "bottom: 100%; left: 50%; margin-left: -5px; border-width: 5px 5px 0; border-color: #333 transparent transparent transparent;";
        case "bottom":
          return "top: 100%; left: 50%; margin-left: -5px; border-width: 0 5px 5px; border-color: transparent transparent #333 transparent;";
        case "left":
          return "top: 50%; right: 100%; margin-top: -5px; border-width: 5px 0 5px 5px; border-color: transparent transparent transparent #333;";
        case "right":
          return "top: 50%; left: 100%; margin-top: -5px; border-width: 5px 5px 5px 0; border-color: transparent #333 transparent transparent;";
        default:
          return "bottom: 100%; left: 50%; margin-left: -5px; border-width: 5px 5px 0; border-color: #333 transparent transparent transparent;";
      }
    }}
  }
`;

interface TooltipProps {
  text: string;
  placement?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, placement = "top", children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = () => {
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  return (
    <TooltipContainer placement={placement} visible={isVisible} onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
      {children}
      <div className="tooltip">
        <div className="arrow" />
        {text}
      </div>
    </TooltipContainer>
  );
};

export default Tooltip;

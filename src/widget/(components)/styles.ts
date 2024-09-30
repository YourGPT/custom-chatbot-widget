import styled from "styled-components";

export const ScrollDiv = styled.div`
  /* Customize the scrollbar's track */
  &::-webkit-scrollbar {
    width: 4px; /* Set the width of the scrollbar */
  }

  /* Customize the scrollbar's thumb (the draggable part) */
  &::-webkit-scrollbar-thumb {
    background: var(--yourgptChatbotPrimaryColor);
    opacity: 0.4;
    border-radius: 0px; /* Round the corners of the thumb */
  }

  /* Customize the scrollbar's track when hovering over it */
  /* &::-webkit-scrollbar-thumb:hover {
    background: #555; 
  } */

  /* Customize the scrollbar's track when it's in a "pressed" state */
  /* &::-webkit-scrollbar-thumb:active {
    background: #444; 
  } */

  /* Customize the scrollbar's track (the empty space) */
  &::-webkit-scrollbar-track {
    background: rgba(var(--yourgptChatbotPrimaryColor), 0.12); /* Set the background color of the track */
  }

  /* Customize the scrollbar's corner (the intersection of horizontal and vertical scrollbars) */
  &::-webkit-scrollbar-corner {
    background: transparent; /* Set the corner background color */
  }
`;

/* Define the cursor blink animation */

export const CursorBlink = styled.span`
  display: inline-block;
  width: 5px; /* Adjust the cursor width as needed */
  height: 1.2em; /* Adjust the cursor height as needed */
  background-color: currentColor; /* Cursor color */
  animation: blink 0.8s infinite; /* Adjust the animation duration as needed */

  @keyframes blink {
    0% {
      opacity: 0; /* Cursor is invisible at the start */
    }
    50% {
      opacity: 0.8; /* Cursor is visible in the middle of the animation */
    }
    100% {
      opacity: 0; /* Cursor is invisible at the end */
    }
  }
`;

export const IconBtn = styled.button<{ color: string }>`
  &&&& {
    all: unset;
    background-color: ${(p) => p.color + "00"};
    color: ${(p) => p.color + "a1"};
    height: 38px;
    aspect-ratio: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 120px;
    transition: all 0.2s;
    padding: 0px;

    &:hover {
      background: ${(p) => p.color + "20"};
      color: ${(p) => p.color + "ff"};
    }
  }
`;

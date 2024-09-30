import React from "react";

export default function CheckIcon({ sx }: { sx?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="lucide lucide-check"
      viewBox="0 0 24 24"
      style={sx}
    >
      <path d="M20 6L9 17l-5-5"></path>
    </svg>
  );
}

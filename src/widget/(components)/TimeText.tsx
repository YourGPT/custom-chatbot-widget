import { useEffect, useState } from "react";

type TimeTextProps = {
  time: number | string;
};

export default function TimeText({ time }: TimeTextProps) {
  function timeAgo(lastMessageTimestamp: number | string): string {
    const currentTime = new Date().getTime();
    const timestamp = typeof lastMessageTimestamp === "string" ? new Date(lastMessageTimestamp).getTime() : lastMessageTimestamp;
    const seconds = Math.floor((currentTime - timestamp) / 1000);

    if (seconds < 3) {
      // If less than 10 seconds, show "Just now"
      return "Just now";
    }

    if (seconds < 60) {
      // If less than 1 minute, show "seconds ago"
      return seconds + " seconds ago";
    }

    if (seconds < 3600) {
      // If less than 1 hour, show in minute intervals
      const interval = Math.floor(seconds / 60);
      return interval + " minute" + (interval === 1 ? "" : "s") + " ago";
    }

    if (seconds < 86400) {
      // If less than 1 day, show in hour intervals
      const interval = Math.floor(seconds / 3600);
      return interval + " hour" + (interval === 1 ? "" : "s") + " ago";
    }

    if (seconds < 2592000) {
      // If less than 30 days, show in day intervals
      const interval = Math.floor(seconds / 86400);
      return interval + " day" + (interval === 1 ? "" : "s") + " ago";
    }

    if (seconds < 31536000) {
      // If less than 365 days, show in month intervals
      const interval = Math.floor(seconds / 2592000);
      return interval + " month" + (interval === 1 ? "" : "s") + " ago";
    }

    // If more than a year, show in year intervals
    const interval = Math.floor(seconds / 31536000);
    return interval + " year" + (interval === 1 ? "" : "s") + " ago";
  }

  const [t, setT] = useState<string>(timeAgo(typeof time === "string" ? time : Number(time)));

  useEffect(() => {
    let tm: any;

    if (time) {
      tm = setInterval(() => {
        setT(timeAgo(typeof time === "string" ? time : Number(time)));
      }, 1000 * 10);
    } else {
      if (tm) {
        clearInterval(tm);
      }
    }
    return () => {
      if (tm) {
        clearInterval(tm);
      }
    };
  }, [time]);

  return <div style={{ opacity: 0.8, whiteSpace: "nowrap" }}>{t}</div>;
}

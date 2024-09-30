export const EVENTS = [
  {
    key: "visitWebsite",
    label: "Visit on website",
  },
  {
    key: "clickElement",
    label: "Click Element",
  },
  {
    key: "leaveWebsite",
    label: "Leave website",
  },
];

// Only one button per page will trigger the Workflow, so if you have multiple buttons they must be on separate pages.

export const CONDITIONS_KEYS = {
  visitWebsite: {
    pageUrls: "pageUrls",
    firstVisit: "firstVisit",
    returningVisit: "returningVisit",
    timeSpent: "timeSpent",
    scrolledPercentage: "scrolledPercentage",
    urlParams: "urlParams",
  },
  clickElement: {
    elementSelectors: "elementSelectors",
  },
  leaveWebsite: {
    delay: "delay",
  },
};

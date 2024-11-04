import Widget from "./widget";
import { getChatbotCreds } from "./widget/utils/helper";
import "./widget/styles/global.scss";
// import * as Sentry from "@sentry/react";

// Sentry.init({
//   dsn: "https://46672c457de43764c007ec34098c1d5c@o4505475767992320.ingest.us.sentry.io/4507100722167808",
//   integrations: [Sentry.browserTracingIntegration()],
//   // Performance Monitoring
//   tracesSampleRate: 1.0, //  Capture 100% of the transactions
//   // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
//   tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
// });

let widgetUid: string;

const res = getChatbotCreds();

console.log(res, "res");

if (res?.widgetUid) {
  widgetUid = res.widgetUid;
  console.log(widgetUid, "widgetUid");
}

export default function App() {
  return <Widget widgetUid={widgetUid} />;
}

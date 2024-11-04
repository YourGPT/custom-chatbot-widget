import crypto from "crypto-js";
export default async (req, res) => {
  if (req.body.event === "ping") {
    console.log("ping event received");
    return res.status(200).json();
  }

  if (req.method === "POST") {
    try {
      const { event, data } = req.body;

      const toSend = {
        name: event,
        data: JSON.stringify(data),
        channel: `${data.widget_uid}-${data.message.session_id}`,
      };

      const vBody = JSON.stringify(toSend);
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const body_md5 = crypto.MD5(vBody).toString(crypto.enc.Hex);
      const auth_version = "1.0";
      const auth_key = PusherData.key;

      // Construct the string to sign
      const path = `/apps/${PusherData.app_id}/events`;
      const queryString = `auth_key=${auth_key}&auth_timestamp=${timestamp}&auth_version=${auth_version}&body_md5=${body_md5}`;
      const stringToSign = `POST\n${path}\n${queryString}`;

      // Generate the auth signature
      const auth_signature = crypto.HmacSHA256(stringToSign, PusherData.secret).toString(crypto.enc.Hex);

      const headers = {
        "Content-Type": "application/json",
      };

      const response = await fetch(
        `https://api-${PusherData.cluster}.pusher.com/apps/${PusherData.app_id}/events?auth_key=${auth_key}&auth_timestamp=${timestamp}&auth_version=${auth_version}&body_md5=${body_md5}&auth_signature=${auth_signature}`,
        {
          method: "POST",
          headers,
          body: vBody,
        }
      );

      if (!response.ok) {
        throw new Error(`Pusher API responded with status: ${response.status}`);
      }

      return res.status(200).json({
        status: apiStatus.SUCCESS,
        message: "Event sent to Pusher",
      });
    } catch (error) {
      console.error(error, "error");
      return res.status(500).json({ message: "Internal server error", status: apiStatus.ERROR, error });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed. Only POST requests are accepted.", status: apiStatus.ERROR });
  }
};

const apiStatus = {
  SUCCESS: "success",
  ERROR: "error",
};

const PusherData = {
  app_id: process.env.VITE_PUSHER_APP_ID,
  key: process.env.VITE_PUSHER_KEY,
  secret: process.env.VITE_PUSHER_SECRET,
  cluster: process.env.VITE_PUSHER_CLUSTER,
};

// Auth signature components:
// - body_md5: Hexadecimal MD5 hash of the JSON-encoded request body
// - auth_version: Always "1.0"
// - auth_timestamp: Number of seconds since January 1, 1970 00:00:00 GMT (within 600s of current time)
// - auth_key: Pusher app key
// - auth_signature: HMAC SHA256 hex digest of the constructed string

// Headers:
// Content-Type: application/json

// const { data, channel, name } = req.body;
// if (!data && !channel && !event) {
//   return res.status(400).json({ message: "Missing data, channel, and event", status: apiStatus.ERROR });
// }
// if (!data) {
//   return res.status(400).json({ message: "Missing data", status: apiStatus.ERROR });
// }
// if (!channel) {
//   return res.status(400).json({ message: "Missing channel", status: apiStatus.ERROR });
// }
// if (!name) {
//   return res.status(400).json({ message: "Missing event", status: apiStatus.ERROR });
// }

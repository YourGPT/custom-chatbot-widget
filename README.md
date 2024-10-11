### 1. **Overview**

This package uses API integration and webhooks to provide a customizable chatbot solution for any use case. Visitor functionality will not work with this setup. Because this widget uses API integration, it offers direct access to session-level functionality, such as session creation and sending messages. We have also set up a webhook for receiving any messages from the studio, ensuring real-time two-way communication.

### 2. **Installation Instructions**

Instead of installing the package, you will need to clone the project from GitHub to set it up locally. Follow these steps to get started:

- Clone the repository:
  ```bash
  git clone https://github.com/YourGPT/custom-chatbot-widget.git
  ```
- Navigate into the project directory:
  ```bash
  cd custom-chatbot-widget
  ```
- Install the required dependencies:
  ```bash
  npm install
  ```

### 3. **Environment Setup**

Before starting, create an environment file for your project. Copy the `.env.example` file provided in the repository and create a new `.env` file. Update the keys in this file with your Pusher and API keys.

```bash
cp .env.example .env
```

Ensure that the `.env` file contains the following:

- `VITE_PUSHER_APP_ID=your_app_id_here`
- `VITE_PUSHER_KEY=your_pusher_key_here`
- `VITE_PUSHER_SECRET=your_pusher_secret_here`
- `VITE_PUSHER_CLUSTER=your_cluster_here`

### 4. **Pusher Setup**

To use the widget effectively, you need to set up Pusher for real-time communication. Follow these steps:

1. **Pusher Account Setup**: Sign up for a [Pusher account](https://pusher.com/).
2. **Create an App**: Create a new app in the Pusher dashboard.
3. **Frontend Key**: Add the Pusher key for frontend use in your `.env` file as follows:
   ```env
   REACT_APP_PUSHER_KEY=your_pusher_key_here
   ```
4. **Backend Key**: Add the Pusher key for backend use in your server environment configuration:
   ```env
   VITE_PUSHER_APP_ID=your_app_id_here
   VITE_PUSHER_KEY=your_pusher_key_here
   VITE_PUSHER_SECRET=your_pusher_secret_here
   VITE_PUSHER_CLUSTER=your_cluster_here
   ```
5. **Webhook Integration**: Set up the webhook to push data using Pusher to the frontend. Add the following webhook URL in your YourGPT webhook integrations:
   ```
   deployed_server_domain/api/chatbot-webhook
   ```
   This will ensure that data from the webhook is properly pushed to the frontend using Pusher.

### 5. **Deploying to Vercel**

You can easily deploy this project to Vercel for hosting. Follow these steps:

1. **Create a Vercel Account**: If you haven't already, create an account at [Vercel](https://vercel.com/).
2. **Deploy**: Connect your GitHub repository to Vercel. Vercel will automatically detect the project settings.
3. **Environment Variables**: During deployment, make sure to add all the environment variables from your `.env` file in the Vercel dashboard.
4. **Build and Deploy**: Vercel will handle the build process. Once deployed, your chatbot widget will be accessible online.

### 6. **Accessing the Widget**

#### **Embedding the Widget on Your Website**

To embed the chatbot widget on your website, use the following script. Replace `deployed_server_domain` with your custom domain from the Vercel deployment and set your specific widget ID.

```html
<script>
  window.YGC_WIDGET_ID = "8449240d-8454-4173-af6e";
  (function () {
    var script = document.createElement("script");
    script.src = "https://deployed_server_domain/script.js";
    script.id = "yourgpt-custom-widget-script";
    document.body.appendChild(script);
  })();
</script>
```

Add this code snippet to your website, and it will load the chatbot widget with your custom configuration.

#### **Direct Link Access**

If you do not want to embed the widget on your website and prefer accessing it via a direct link, you can use the following URL pattern:

```
https://deployed_server_domain/8449240d-8454-4173-af6e
```

Replace `8449240d-8454-4173-af6e`Â with your specific widget ID. This link provides direct access to the deployed chatbot.

### 7. **FAQs & Troubleshooting**

&#x20;For detailed issues, users are encouraged to check the source code for troubleshooting. If further help is needed, drop a query in our Discord server: [Join our community](https://discord.gg/JfSH3qFdFc).

### 8. **Custom Domain Note**

For custom deployment, replace references to `widget.yourgpt.ai` with either your deployed Vercel domain or `localhost` if running locally.

### 9. **Contributing Guidelines**

For any questions or discussions, please join our Discord community using this link: [Join our community](https://discord.gg/JfSH3qFdFc).

### 10. **License**

This project is licensed under the MIT License. Users are allowed to modify the code as needed for their own purposes, but they cannot resell it or use it for applications other than YourGPT use cases. &#x20;

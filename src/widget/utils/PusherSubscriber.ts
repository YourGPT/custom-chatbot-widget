import Pusher from "pusher-js";



const PusherData = {
  key: "840e896e0629989acd53",
  cluster: "ap2",
};
class PusherSubscriber {
  private static instance: PusherSubscriber;
  private pusher: Pusher;

  private constructor() {
    this.pusher = new Pusher(PusherData.key, {
      cluster: PusherData.cluster,
    });
  }

  public static getInstance(): PusherSubscriber {
    if (!PusherSubscriber.instance) {
      PusherSubscriber.instance = new PusherSubscriber();
    }
    return PusherSubscriber.instance;
  }

  subscribe(channelName: string, eventName: string, callback: (data: any) => void): void {
    const channel = this.pusher.subscribe(channelName);

    channel.bind(eventName, (data: any) => {
      callback(data);
    });

    channel.bind("pusher:error", (error: any) => {
      console.error("Pusher subscription error:", error);
    });
  }

  unsubscribe(channelName: string) {
    this.pusher.unsubscribe(channelName);
  }
}

const pusherSubscriber = PusherSubscriber.getInstance();

export default pusherSubscriber;

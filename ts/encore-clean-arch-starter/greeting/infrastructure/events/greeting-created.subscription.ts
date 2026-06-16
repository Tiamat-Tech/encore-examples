import log from "encore.dev/log";
import { Subscription } from "encore.dev/pubsub";

import { greetingCreatedTopic } from "./greeting-events.topic";

/**
 * A Pub/Sub subscription that reacts to greeting-created events. A real app might
 * fan out to analytics or notifications; here it records the event in the log so
 * you can watch it flow through in the local dev dashboard.
 */
export const logGreetingCreated = new Subscription(greetingCreatedTopic, "log-greeting-created", {
  handler: async (msg) => {
    log.info("greeting created", {
      recipient: msg.recipient,
      visitorNumber: msg.visitorNumber,
    });
  },
});

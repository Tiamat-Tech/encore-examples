import { Topic } from "encore.dev/pubsub";

/** The message shape broadcast when a greeting is created. */
export interface GreetingCreatedMessage {
  recipient: string;
  visitorNumber: number;
}

/** Encore Pub/Sub topic for greeting-created events. */
export const greetingCreatedTopic = new Topic<GreetingCreatedMessage>("greeting-created", {
  deliveryGuarantee: "at-least-once",
});

import type { EventPublisherPort } from "../../application/ports/event-publisher.port";
import type { DomainEvent } from "../../domain/events/domain-event";
import { GreetingCreated } from "../../domain/events/greeting-created.event";
import { greetingCreatedTopic } from "./greeting-events.topic";

/**
 * Driven adapter: publishes domain events to Encore Pub/Sub. The application
 * depends on `EventPublisherPort`; this maps each domain event to its topic.
 */
export class PubSubEventPublisher implements EventPublisherPort {
  async publishAll(events: readonly DomainEvent[]): Promise<void> {
    for (const event of events) {
      if (event instanceof GreetingCreated) {
        await greetingCreatedTopic.publish({
          recipient: event.recipient,
          visitorNumber: event.visitorNumber,
        });
      }
    }
  }
}

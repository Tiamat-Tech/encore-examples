import type { DomainEvent } from "../../domain/events/domain-event";

/** Driven port: publishes domain events raised by aggregates. */
export interface EventPublisherPort {
  publishAll(events: readonly DomainEvent[]): Promise<void>;
}

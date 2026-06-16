import type { DomainEvent } from "./events/domain-event";
import { GreetingCreated } from "./events/greeting-created.event";
import type { Language } from "./language.vo";
import type { Recipient } from "./recipient.vo";

interface GreetingProps {
  id: string;
  recipient: Recipient;
  language: Language;
  message: string;
  visitorNumber: number;
  createdAt: Date;
}

/**
 * Greeting — the aggregate root.
 *
 * Construction goes through `create`, which enforces the invariants and records
 * a `GreetingCreated` domain event. State is exposed through getters; the entity
 * never leaks its internals or depends on anything outside the domain.
 */
export class Greeting {
  private readonly events: DomainEvent[] = [];

  private constructor(private readonly props: GreetingProps) {}

  static create(props: GreetingProps): Greeting {
    if (props.message.trim().length === 0) {
      throw new Error("Greeting message must not be empty.");
    }
    if (!Number.isInteger(props.visitorNumber) || props.visitorNumber < 1) {
      throw new Error("visitorNumber must be a positive integer.");
    }
    const greeting = new Greeting(props);
    greeting.events.push(new GreetingCreated(props.recipient.value, props.visitorNumber));
    return greeting;
  }

  /** Reconstitute a persisted aggregate from storage — no events are raised. */
  static restore(props: GreetingProps): Greeting {
    return new Greeting(props);
  }

  get id(): string {
    return this.props.id;
  }
  get recipient(): string {
    return this.props.recipient.value;
  }
  get language(): string {
    return this.props.language.code;
  }
  get message(): string {
    return this.props.message;
  }
  get visitorNumber(): number {
    return this.props.visitorNumber;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /** Drains and returns the events raised since the last pull. */
  pullEvents(): readonly DomainEvent[] {
    const drained = [...this.events];
    this.events.length = 0;
    return drained;
  }
}

import type { DomainEvent } from "./domain-event";

/** Raised by the Greeting aggregate when a new greeting is created. */
export class GreetingCreated implements DomainEvent {
  readonly type = "greeting.created";

  constructor(
    readonly recipient: string,
    readonly visitorNumber: number,
  ) {}
}

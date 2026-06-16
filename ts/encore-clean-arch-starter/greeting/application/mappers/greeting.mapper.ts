import type { Greeting } from "../../domain/greeting.entity";

/** The shape returned to the outside world — never the entity itself. */
export interface GreetingView {
  id: string;
  recipient: string;
  language: string;
  message: string;
  visitor: number;
  createdAt: string;
}

/** Maps the Greeting aggregate to its read model. */
export class GreetingMapper {
  static toView(greeting: Greeting): GreetingView {
    return {
      id: greeting.id,
      recipient: greeting.recipient,
      language: greeting.language,
      message: greeting.message,
      visitor: greeting.visitorNumber,
      createdAt: greeting.createdAt.toISOString(),
    };
  }
}

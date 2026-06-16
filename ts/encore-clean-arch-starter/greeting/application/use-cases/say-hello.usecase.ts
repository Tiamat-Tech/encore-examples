import { Greeting } from "../../domain/greeting.entity";
import { Language } from "../../domain/language.vo";
import type { GreetingRepositoryPort } from "../../domain/ports/greeting-repository.port";
import { Recipient } from "../../domain/recipient.vo";
import { GreetingTranslator } from "../../domain/services/greeting-translator";
import { GreetingMapper, type GreetingView } from "../mappers/greeting.mapper";
import type { ClockPort } from "../ports/clock.port";
import type { EventPublisherPort } from "../ports/event-publisher.port";
import type { IdGeneratorPort } from "../ports/id-generator.port";

/** Co-located input DTO — `appliesTo: class` in the contract ignores it. */
export interface SayHelloInput {
  name: string;
  language?: string;
}

/**
 * SayHelloUseCase — the command. It validates input through the domain, derives
 * the visitor number, composes a localized message via the domain service, builds
 * and persists the aggregate, publishes its events, and returns a read model.
 *
 * Every collaborator is a PORT, so the use-case is pure orchestration: no Encore,
 * no database, no clock, no uuid — all injected, all swappable, all testable.
 */
export class SayHelloUseCase {
  constructor(
    private readonly greetings: GreetingRepositoryPort,
    private readonly clock: ClockPort,
    private readonly ids: IdGeneratorPort,
    private readonly events: EventPublisherPort,
  ) {}

  async execute(input: SayHelloInput): Promise<GreetingView> {
    const recipient = Recipient.create(input.name);
    const language = Language.create(input.language);
    const visitorNumber = (await this.greetings.total()) + 1;
    const message = GreetingTranslator.translate(recipient, language, visitorNumber);

    const greeting = Greeting.create({
      id: this.ids.generate(),
      recipient,
      language,
      message,
      visitorNumber,
      createdAt: this.clock.now(),
    });

    await this.greetings.save(greeting);
    await this.events.publishAll(greeting.pullEvents());

    return GreetingMapper.toView(greeting);
  }
}

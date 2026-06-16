import { describe, expect, test } from "vitest";

import type { Greeting } from "../domain/greeting.entity";
import type { DomainEvent } from "../domain/events/domain-event";
import type { GreetingRepositoryPort } from "../domain/ports/greeting-repository.port";
import type { ClockPort } from "./ports/clock.port";
import type { EventPublisherPort } from "./ports/event-publisher.port";
import type { IdGeneratorPort } from "./ports/id-generator.port";
import { SayHelloUseCase } from "./use-cases/say-hello.usecase";

// Every dependency is a port, so the use-case tests with hand-rolled fakes —
// no database, no clock, no Encore. This is the testability dividend of the
// dependency rule.
class FakeRepo implements GreetingRepositoryPort {
  readonly saved: Greeting[] = [];
  async save(greeting: Greeting): Promise<void> {
    this.saved.push(greeting);
  }
  async total(): Promise<number> {
    return this.saved.length;
  }
  async findRecent(limit: number): Promise<readonly Greeting[]> {
    return this.saved.slice(-limit).reverse();
  }
}
const fixedClock: ClockPort = { now: () => new Date("2024-01-01T00:00:00.000Z") };
const seqIds: IdGeneratorPort = (() => {
  let n = 0;
  return { generate: () => `id-${++n}` };
})();
class CollectingPublisher implements EventPublisherPort {
  readonly events: DomainEvent[] = [];
  async publishAll(events: readonly DomainEvent[]): Promise<void> {
    this.events.push(...events);
  }
}

describe("SayHelloUseCase", () => {
  test("greets, assigns the next visitor number, and publishes the event", async () => {
    const repo = new FakeRepo();
    const publisher = new CollectingPublisher();
    const useCase = new SayHelloUseCase(repo, fixedClock, seqIds, publisher);

    const first = await useCase.execute({ name: "Ada" });
    expect(first.message).toBe("Hello, Ada! You are visitor #1.");
    expect(first.visitor).toBe(1);

    const second = await useCase.execute({ name: "Linus", language: "pt" });
    expect(second.message).toBe("Olá, Linus! Você é o visitante #2.");

    expect(repo.saved).toHaveLength(2);
    expect(publisher.events).toHaveLength(2);
  });

  test("rejects an invalid recipient", async () => {
    const useCase = new SayHelloUseCase(new FakeRepo(), fixedClock, seqIds, new CollectingPublisher());
    await expect(useCase.execute({ name: "" })).rejects.toThrow();
  });
});

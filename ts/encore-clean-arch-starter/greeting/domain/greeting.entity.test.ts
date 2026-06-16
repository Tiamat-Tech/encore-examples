import { describe, expect, test } from "vitest";

import { GreetingCreated } from "./events/greeting-created.event";
import { Greeting } from "./greeting.entity";
import { Language } from "./language.vo";
import { Recipient } from "./recipient.vo";
import { GreetingTranslator } from "./services/greeting-translator";

// Pure domain — no Encore, no I/O, no mocks.
const baseProps = {
  id: "id-1",
  recipient: Recipient.create("World"),
  language: Language.create("en"),
  message: "Hello, World! You are visitor #1.",
  visitorNumber: 1,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
};

describe("Greeting", () => {
  test("creates a valid aggregate and raises a GreetingCreated event", () => {
    const greeting = Greeting.create(baseProps);
    expect(greeting.message).toBe("Hello, World! You are visitor #1.");

    const events = greeting.pullEvents();
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(GreetingCreated);
    expect(greeting.pullEvents()).toHaveLength(0); // drained
  });

  test("rejects a non-positive visitor number", () => {
    expect(() => Greeting.create({ ...baseProps, visitorNumber: 0 })).toThrow();
  });
});

describe("Recipient", () => {
  test("trims and accepts a valid name", () => {
    expect(Recipient.create("  Ada  ").value).toBe("Ada");
  });
  test("rejects an empty name", () => {
    expect(() => Recipient.create("   ")).toThrow();
  });
});

describe("Language + GreetingTranslator", () => {
  test("defaults to English and localizes", () => {
    const msg = GreetingTranslator.translate(Recipient.create("Ada"), Language.create(), 3);
    expect(msg).toBe("Hello, Ada! You are visitor #3.");
  });
  test("localizes to Portuguese", () => {
    const msg = GreetingTranslator.translate(Recipient.create("Ada"), Language.create("pt"), 3);
    expect(msg).toBe("Olá, Ada! Você é o visitante #3.");
  });
  test("rejects an unsupported language", () => {
    expect(() => Language.create("xx")).toThrow();
  });
});

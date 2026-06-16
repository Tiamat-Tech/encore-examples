import { Language } from "../language.vo";
import { Recipient } from "../recipient.vo";

/**
 * GreetingTranslator — a Domain Service.
 *
 * Localizing a greeting is pure business logic that belongs to no single entity
 * or value object, so it lives in a stateless domain service. No framework, no
 * I/O — just the rule.
 */
export class GreetingTranslator {
  private static readonly TEMPLATES: Record<string, (name: string, n: number) => string> = {
    en: (name, n) => `Hello, ${name}! You are visitor #${n}.`,
    pt: (name, n) => `Olá, ${name}! Você é o visitante #${n}.`,
    es: (name, n) => `¡Hola, ${name}! Eres el visitante #${n}.`,
  };

  static translate(recipient: Recipient, language: Language, visitorNumber: number): string {
    const template = GreetingTranslator.TEMPLATES[language.code] ?? GreetingTranslator.TEMPLATES["en"]!;
    return template(recipient.value, visitorNumber);
  }
}

import { InvalidRecipientError } from "./errors/invalid-recipient.error";

/**
 * Recipient — a Value Object for "who is being greeted".
 *
 * Immutable, equal by value, and self-validating: an instance can only exist if
 * it is valid. The private constructor forces creation through `create`, the one
 * place the invariant lives.
 */
export class Recipient {
  private constructor(public readonly value: string) {}

  static create(raw: string): Recipient {
    const name = raw.trim();
    if (name.length === 0) {
      throw new InvalidRecipientError("must not be empty");
    }
    if (name.length > 64) {
      throw new InvalidRecipientError("must be at most 64 characters");
    }
    return new Recipient(name);
  }

  equals(other: Recipient): boolean {
    return this.value === other.value;
  }
}

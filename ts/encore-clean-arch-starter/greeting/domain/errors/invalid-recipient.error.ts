import { DomainError } from "./domain-error";

export class InvalidRecipientError extends DomainError {
  constructor(reason: string) {
    super(`Invalid recipient: ${reason}.`);
  }
}

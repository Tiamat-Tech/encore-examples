import { DomainError } from "./domain-error";

export class UnsupportedLanguageError extends DomainError {
  constructor(code: string, supported: readonly string[]) {
    super(`Unsupported language "${code}". Supported: ${supported.join(", ")}.`);
  }
}

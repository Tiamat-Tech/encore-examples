/**
 * DomainError — the base type for every error the domain can raise.
 *
 * Adapters (e.g. the HTTP layer) can catch this single type and map any domain
 * failure to a transport-specific error, without the domain knowing about HTTP.
 */
export abstract class DomainError extends Error {
  protected constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

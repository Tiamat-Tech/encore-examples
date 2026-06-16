/** Driven port: generates unique identifiers. Keeps `crypto`/uuid out of the core. */
export interface IdGeneratorPort {
  generate(): string;
}

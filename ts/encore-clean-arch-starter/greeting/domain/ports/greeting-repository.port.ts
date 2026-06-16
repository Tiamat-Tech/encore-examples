import type { Greeting } from "../greeting.entity";

/**
 * GreetingRepositoryPort — a driven (secondary) port.
 *
 * The domain owns this persistence contract; infrastructure provides an adapter.
 * Application use-cases depend on this interface, never on a concrete store —
 * swap in-memory for an Encore `SQLDatabase` adapter and nothing here changes.
 */
export interface GreetingRepositoryPort {
  save(greeting: Greeting): Promise<void>;
  total(): Promise<number>;
  findRecent(limit: number): Promise<readonly Greeting[]>;
}

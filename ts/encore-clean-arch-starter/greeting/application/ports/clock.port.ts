/** Driven port: the source of "now". Lets use-cases stay deterministic and testable. */
export interface ClockPort {
  now(): Date;
}

import type { ClockPort } from "../../application/ports/clock.port";

/** Driven adapter: the real system clock. */
export class SystemClock implements ClockPort {
  now(): Date {
    return new Date();
  }
}

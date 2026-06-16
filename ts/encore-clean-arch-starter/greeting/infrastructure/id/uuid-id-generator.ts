import { randomUUID } from "node:crypto";

import type { IdGeneratorPort } from "../../application/ports/id-generator.port";

/** Driven adapter: generates UUIDs using the Node runtime. */
export class UuidIdGenerator implements IdGeneratorPort {
  generate(): string {
    return randomUUID();
  }
}

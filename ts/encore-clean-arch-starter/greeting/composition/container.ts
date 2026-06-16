import { CheckHealthUseCase } from "../application/use-cases/check-health.usecase";
import { GetVersionUseCase } from "../application/use-cases/get-version.usecase";
import { ListRecentGreetingsUseCase } from "../application/use-cases/list-recent-greetings.usecase";
import { SayHelloUseCase } from "../application/use-cases/say-hello.usecase";
import { SystemClock } from "../infrastructure/clock/system-clock";
import { PubSubEventPublisher } from "../infrastructure/events/pubsub-event-publisher";
import { UuidIdGenerator } from "../infrastructure/id/uuid-id-generator";
import { SqlGreetingRepository } from "../infrastructure/repositories/sql-greeting.repository";

/**
 * Composition root for the greeting service.
 *
 * The single place in the codebase that references concrete adapters: it builds
 * infrastructure, injects it into the application use-cases, and exposes them
 * ready to use. Swapping an adapter (e.g. in-memory -> SQLDatabase) is a one-line
 * change here and nowhere else. The architecture contract forbids any other layer
 * from importing `infrastructure`, so this stays true.
 */
const greetingRepository = new SqlGreetingRepository();
const clock = new SystemClock();
const idGenerator = new UuidIdGenerator();
const eventPublisher = new PubSubEventPublisher();

export const sayHelloUseCase = new SayHelloUseCase(
  greetingRepository,
  clock,
  idGenerator,
  eventPublisher,
);
export const listRecentGreetingsUseCase = new ListRecentGreetingsUseCase(greetingRepository);
export const getVersionUseCase = new GetVersionUseCase();
export const checkHealthUseCase = new CheckHealthUseCase();

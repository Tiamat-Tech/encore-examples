import type { GreetingRepositoryPort } from "../../domain/ports/greeting-repository.port";
import { GreetingMapper, type GreetingView } from "../mappers/greeting.mapper";

export interface ListRecentGreetingsInput {
  limit?: number;
}

/** ListRecentGreetingsUseCase — the query side: read recent greetings, bounded. */
export class ListRecentGreetingsUseCase {
  private static readonly DEFAULT_LIMIT = 10;
  private static readonly MAX_LIMIT = 50;

  constructor(private readonly greetings: GreetingRepositoryPort) {}

  async execute(input: ListRecentGreetingsInput): Promise<GreetingView[]> {
    const requested = input.limit ?? ListRecentGreetingsUseCase.DEFAULT_LIMIT;
    const limit = Math.max(1, Math.min(requested, ListRecentGreetingsUseCase.MAX_LIMIT));
    const greetings = await this.greetings.findRecent(limit);
    return greetings.map((greeting) => GreetingMapper.toView(greeting));
  }
}

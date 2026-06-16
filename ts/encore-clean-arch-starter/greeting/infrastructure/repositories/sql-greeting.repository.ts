import { Greeting } from "../../domain/greeting.entity";
import { Language } from "../../domain/language.vo";
import type { GreetingRepositoryPort } from "../../domain/ports/greeting-repository.port";
import { Recipient } from "../../domain/recipient.vo";
import { greetingDB } from "../database";

interface GreetingRow {
  id: string;
  recipient: string;
  language: string;
  message: string;
  visitor_number: number;
  created_at: Date;
}

/**
 * Driven adapter: a Postgres-backed implementation of the greeting repository
 * port, using Encore's `SQLDatabase`. The domain and application layers depend on
 * the port, not on this — so persistence is a detail, swappable in one place.
 */
export class SqlGreetingRepository implements GreetingRepositoryPort {
  async save(greeting: Greeting): Promise<void> {
    await greetingDB.exec`
      INSERT INTO greetings (id, recipient, language, message, visitor_number, created_at)
      VALUES (
        ${greeting.id}, ${greeting.recipient}, ${greeting.language},
        ${greeting.message}, ${greeting.visitorNumber}, ${greeting.createdAt}
      )
    `;
  }

  async total(): Promise<number> {
    const row = await greetingDB.queryRow<{ count: number }>`
      SELECT COUNT(*)::int AS count FROM greetings
    `;
    return row?.count ?? 0;
  }

  async findRecent(limit: number): Promise<readonly Greeting[]> {
    const rows = greetingDB.query<GreetingRow>`
      SELECT id, recipient, language, message, visitor_number, created_at
      FROM greetings
      ORDER BY created_at DESC, visitor_number DESC
      LIMIT ${limit}
    `;
    const greetings: Greeting[] = [];
    for await (const row of rows) {
      greetings.push(this.toEntity(row));
    }
    return greetings;
  }

  private toEntity(row: GreetingRow): Greeting {
    return Greeting.restore({
      id: row.id,
      recipient: Recipient.create(row.recipient),
      language: Language.create(row.language),
      message: row.message,
      visitorNumber: row.visitor_number,
      createdAt: new Date(row.created_at),
    });
  }
}

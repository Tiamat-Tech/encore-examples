import { api } from "encore.dev/api";

import type { GreetingView } from "../application/mappers/greeting.mapper";
import {
  checkHealthUseCase,
  getVersionUseCase,
  listRecentGreetingsUseCase,
  sayHelloUseCase,
} from "../composition/container";
import { toAPIError } from "./http-error-mapper";

// The api layer (Encore handlers). Each handler only adapts HTTP <-> use-case
// and maps errors — no business logic, no `new`, no infrastructure.

// GET /hello/:name?lang=pt — greet a recipient and count the visit.
export const hello = api(
  { expose: true, method: "GET", path: "/hello/:name" },
  async ({ name, lang }: { name: string; lang?: string }): Promise<GreetingView> => {
    try {
      return await sayHelloUseCase.execute({ name, language: lang });
    } catch (err) {
      throw toAPIError(err);
    }
  },
);

interface RecentResponse {
  greetings: GreetingView[];
}

// GET /greetings/recent?limit=10 — list the most recent greetings.
export const recent = api(
  { expose: true, method: "GET", path: "/greetings/recent" },
  async ({ limit }: { limit?: number }): Promise<RecentResponse> => {
    return { greetings: await listRecentGreetingsUseCase.execute({ limit }) };
  },
);

interface VersionResponse {
  name: string;
  version: string;
}

// GET /version — the application name and version.
export const version = api(
  { expose: true, method: "GET", path: "/version" },
  async (): Promise<VersionResponse> => {
    return getVersionUseCase.execute();
  },
);

interface HealthResponse {
  status: "ok";
  service: string;
}

// GET /health — a liveness probe.
export const health = api(
  { expose: true, method: "GET", path: "/health" },
  async (): Promise<HealthResponse> => {
    return checkHealthUseCase.execute();
  },
);

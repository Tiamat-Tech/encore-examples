export interface HealthView {
  status: "ok";
  service: string;
}

/** CheckHealthUseCase — a liveness probe, kept in the application layer for consistency. */
export class CheckHealthUseCase {
  async execute(): Promise<HealthView> {
    return { status: "ok", service: "greeting" };
  }
}

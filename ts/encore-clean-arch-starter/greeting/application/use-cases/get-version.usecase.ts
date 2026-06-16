import { APP_INFO } from "../../domain/app-info";

export interface VersionView {
  name: string;
  version: string;
}

/** GetVersionUseCase — returns application identity. Pure, dependency-free. */
export class GetVersionUseCase {
  async execute(): Promise<VersionView> {
    return { name: APP_INFO.name, version: APP_INFO.version };
  }
}

import { APIError } from "encore.dev/api";

import { DomainError } from "../domain/errors/domain-error";

/**
 * Translates a failure into an Encore APIError at the HTTP boundary. Domain
 * errors become 400s; everything else is an internal error. This is the only
 * place that knows both the domain's error type and the transport's.
 */
export function toAPIError(err: unknown): APIError {
  if (err instanceof DomainError) {
    return APIError.invalidArgument(err.message);
  }
  if (err instanceof Error) {
    return APIError.internal(err.message);
  }
  return APIError.internal("Unexpected error");
}

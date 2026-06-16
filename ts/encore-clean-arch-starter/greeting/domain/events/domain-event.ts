/** Marker interface every domain event implements. */
export interface DomainEvent {
  readonly type: string;
}

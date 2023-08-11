export interface IInteractorQuery<
  O extends `${string}_${'asc' | 'desc'}` = `${string}_${'asc' | 'desc'}`,
> {
  limit?: number;
  offset?: number;
  cursor?: string;
  order?: O;
}

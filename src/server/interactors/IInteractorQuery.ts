export interface IInteractorQuery<O extends [string, 'asc' | 'desc'] = [string, 'asc' | 'desc']> {
  limit?: number;
  offset?: number;
  cursor?: string;
  order?: O;
}

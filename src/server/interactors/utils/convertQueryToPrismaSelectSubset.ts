import { IInteractorQuery } from '../IInteractorQuery';
import { convertOrderToPrismaOrderBy } from './convertOrderToPrismaOrderBy';

export const convertQueryToPrismaSelectSubset = <
  O extends `${string}_${'asc' | 'desc'}` = `${string}_${'asc' | 'desc'}`,
>(
  query: IInteractorQuery<O>,
) => ({
  orderBy: query.order ? convertOrderToPrismaOrderBy(query.order) : undefined,
  take: query.limit,
  skip: query.offset,
  cursor: { id: query.cursor },
});

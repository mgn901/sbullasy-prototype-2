export const convertOrderToPrismaOrderBy = <T extends string, U extends string>(
  order: readonly [T, U],
) => ({ [order[0]]: order[1] });

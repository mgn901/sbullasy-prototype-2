export const convertOrderToPrismaOrderBy = <T extends `${string}_${'asc' | 'desc'}`>(order: T) => {
  const [key, value] = order.split('_');
  return { [key]: value };
};

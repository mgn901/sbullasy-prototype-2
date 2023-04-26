import { RawBuilder, sql } from 'kysely';

export const arrayRawBuilder = <T extends string | number | boolean>(array: T[]): RawBuilder<T[]> => {
	return sql`ARRAY[${sql.join(array)}]`;
}

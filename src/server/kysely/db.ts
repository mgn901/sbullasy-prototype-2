import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Database } from '../Database';

export const db = new Kysely<Database>({
	dialect: new PostgresDialect({
		pool: new Pool({
			host: process.env.SBULLASY_APP_DB_HOST!,
			port: Number(process.env.SBULLASY_APP_DB_PORT!),
			user: process.env.SBULLASY_APP_DB_USERNAME!,
			password: process.env.SBULLASY_APP_DB_PASSWORD!,
			database: process.env.SBULLASY_APP_DB_DB!,
		}),
	}),
});

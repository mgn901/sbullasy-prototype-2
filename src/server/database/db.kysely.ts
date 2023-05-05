import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { TDatabase } from './TDatabase';
import { envs } from '../env/envs';

export const db = new Kysely<TDatabase>({
	dialect: new PostgresDialect({
		pool: new Pool({
			host: envs.SBULLASY_APP_DB_HOST,
			port: Number(envs.SBULLASY_APP_DB_PORT),
			user: envs.SBULLASY_APP_DB_USERNAME,
			password: envs.SBULLASY_APP_DB_PASSWORD,
			database: envs.SBULLASY_APP_DB_DB,
		}),
	}),
});

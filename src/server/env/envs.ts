const isNonNullableRecord = <K extends string, V extends any>(envs: Record<K, V>): envs is Record<K, NonNullable<V>> => {
	let isNonNullableRecord = true;
	Object.entries(envs).forEach(([key, value]) => {
		if (!value) {
			isNonNullableRecord = false;
		}
	});
	return isNonNullableRecord;
}

const {
	SBULLASY_APP_SCHEME = 'http',
	SBULLASY_APP_HOST,
	SBULLASY_APP_PORT,
	SBULLASY_APP_DB_HOST,
	SBULLASY_APP_DB_PORT,
	SBULLASY_APP_DB_DB,
	SBULLASY_APP_DB_USERNAME,
	SBULLASY_APP_DB_PASSWORD,
	SBULLASY_APP_ADMIN_EMAIL,
	SBULLASY_APP_ADMIN_PASSWORD,
	SBULLASY_APP_ADMIN_DISPLAYNAME = 'admin',
	SBULLASY_APP_SMTP_HOST,
	SBULLASY_APP_SMTP_PORT,
	SBULLASY_APP_SMTP_USEREMAIL,
	SBULLASY_APP_SMTP_PASSWORD,
} = process.env;

export const envs = (() => {
	const envsBeforeCheck = {
		SBULLASY_APP_SCHEME,
		SBULLASY_APP_HOST,
		SBULLASY_APP_PORT,
		SBULLASY_APP_DB_HOST,
		SBULLASY_APP_DB_PORT,
		SBULLASY_APP_DB_DB,
		SBULLASY_APP_DB_USERNAME,
		SBULLASY_APP_DB_PASSWORD,
		SBULLASY_APP_ADMIN_EMAIL,
		SBULLASY_APP_ADMIN_PASSWORD,
		SBULLASY_APP_ADMIN_DISPLAYNAME,
		SBULLASY_APP_SMTP_HOST,
		SBULLASY_APP_SMTP_PORT,
		SBULLASY_APP_SMTP_USEREMAIL,
		SBULLASY_APP_SMTP_PASSWORD,
	} as const;
	if (!(isNonNullableRecord(envsBeforeCheck))) {
		throw new Error('Necessary envs are not passed.');
	}
	return envsBeforeCheck;
})();


type AssertNonNullableDict = <K extends string, V extends unknown>(
  object: Record<K, V>,
) => asserts object is Record<K, NonNullable<V>>;

const assertNonNullableDict: AssertNonNullableDict = (object) => {
  const checkResult = Object.entries(object)
    .map(([key, value]) => {
      if (value) return [key, true] as const;
      return [key, false] as const;
    })
    .filter((entry) => !entry[1]);

  if (checkResult.length !== 0) {
    const undefinedEnvs = checkResult.map(([key]) => key).join(', ');
    throw new Error(`Necessary envs are not passed: ${undefinedEnvs}`);
  }
};

export const envLoader = (env: NodeJS.ProcessEnv) => {
  const {
    SBULLASY_APP_SCHEME = 'http',
    SBULLASY_APP_HOST,
    SBULLASY_APP_PORT,
    SBULLASY_APP_DB_URL,
    SBULLASY_APP_ADMIN_EMAIL,
    SBULLASY_APP_SMTP_HOST,
    SBULLASY_APP_SMTP_PORT,
    SBULLASY_APP_SMTP_USEREMAIL,
    SBULLASY_APP_SMTP_PASSWORD,
  } = env;
  const envDict = {
    SBULLASY_APP_SCHEME,
    SBULLASY_APP_HOST,
    SBULLASY_APP_PORT,
    SBULLASY_APP_DB_URL,
    SBULLASY_APP_ADMIN_EMAIL,
    SBULLASY_APP_SMTP_HOST,
    SBULLASY_APP_SMTP_PORT,
    SBULLASY_APP_SMTP_USEREMAIL,
    SBULLASY_APP_SMTP_PASSWORD,
  } as const;

  assertNonNullableDict(envDict);

  return envDict;
};

type EnvironmentName = 'local';

const SUPPORTED_ENVIRONMENTS: EnvironmentName[] = ['local'];

const asEnvironmentName = (value: string): EnvironmentName => {
	const matched = SUPPORTED_ENVIRONMENTS.find((env) => env === value);

	if (!matched) {
		throw new Error(
			`Unsupported TEST_ENV '${value}'. Expected one of: ${SUPPORTED_ENVIRONMENTS.join(', ')}`,
		);
	}

	return matched;
};

const resolveEnvValue = (
	environment: EnvironmentName,
	prefix: 'API',
	defaultValue?: string,
): string => {
	const key = `${prefix}_${environment.toUpperCase()}_BASE_URL`;
	const configuredValue = process.env[key]?.trim();

	if (configuredValue) {
		return configuredValue;
	}

	if (defaultValue) {
		return defaultValue;
	}

	throw new Error(
		`${key} is required when TEST_ENV=${environment}. Set it in your environment.`,
	);
};

export const resolveTestEnvironment = (): EnvironmentName => {
	const rawEnvironment = process.env.TEST_ENV?.trim() || 'local';
	return asEnvironmentName(rawEnvironment);
};

export const resolveApiBaseUrl = (): string => {
	const environment = resolveTestEnvironment();
	return resolveEnvValue(environment, 'API', 'http://localhost:3001');
};

const nextJest = require('next/jest');

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
	// Add more setup options before each test is run
	// setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	// if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
	moduleDirectories: ['node_modules', '<rootDir>/'],
	testEnvironmentOptions: { customExportConditions: ['node', 'node-addons'] },
	testEnvironment: '<rootDir>/jest.environment.cjs',
	setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
	moduleNameMapper: {
		'@/components/(.*)': '<rootDir>/components/$1',
	},
	modulePathIgnorePatterns: ['<rootDir>/__e2e__'],
	transformIgnorePatterns: ['<rootDir>/node_modules/(?!jose)'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = async () => ({
	...(await createJestConfig(customJestConfig)()),
	watchman: false,
	testMatch: ['<rootDir>/__tests__/**/*.test.[jt]s?(x)'],
	transformIgnorePatterns: [
		'/node_modules/(?!(?:jose|until-async|@mswjs|msw|rettime|@open-draft)/)',
	],
});

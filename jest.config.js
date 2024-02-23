module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coveragePathIgnorePatterns: [
        '<rootDir>/src/lib/routes/test.ts',
        '<rootDir>/src/lib/models/model.ts',
        '<rootDir>/src/lib/mysql/MySQLConnection.ts', // lib already tested
        '<rootDir>/src/lib/mysql/MySQLPool.ts', // lib already tested
        '<rootDir>/src/lib/router.ts', // lib already tested
        '<rootDir>/src/lib/middlewares/post.ts', // lib already tested
        '<rootDir>/src/lib/middlewares/with-connection.ts', // lib already tested
        '<rootDir>/src/lib/types/http-error.ts', // lib already tested
    ],
    transform: {
		"^.+\\.js$": "<rootDir>/.jest.transform.js",
	},
    testPathIgnorePatterns: [
        '<rootDir>/tests/legacy/*',
        '<rootDir>/src/lib/routes/test.ts',
        '<rootDir>/build/*'
    ],
    transformIgnorePatterns: []
}

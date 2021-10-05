export default {
  name: '@lotusengine/cli',
  displayName: 'CLI',
  testEnvironment: 'jest-environment-node',
  // globalSetup: './test/setup.ts',
  // setupFilesAfterEnv: ['./test/bootstrap.ts'],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {},
  modulePaths: ['<rootDir>/src', '<rootDir>/test', '<rootDir>'],
  preset: 'ts-jest'
}

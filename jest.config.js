const { defaults } = require('jest-config');

module.exports = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'vue'],
  setupFiles: ['<rootDir>/.jest/register-context.js', 'jest-canvas-mock'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(lodash-es/|vuetify/|@storybook/.*\\.vue$|.*\\.css$))'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  snapshotSerializers: ['jest-serializer-vue'],
  testMatch: [
    '<rootDir>/src/**/*.spec.(ts|tsx)',
    '<rootDir>/storyshots/storyshots.spec.ts'
  ],
  testURL: 'http://localhost/',
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!**/node_modules/**',
    // テストコードなのでカバレッジには含めない
    '!src/**/*.stories.ts',
    // テスト内容を検討中なので除外
    '!src/plugins/vuetify.ts',
    '!src/**/*.vue',
    '!src/**/{store,main,registerServiceWorker}.ts'
  ],
  coverageReporters: ['json', 'lcov', 'text-summary'],
  globals: {
    'ts-jest': {
      babelConfig: true
    }
  }
};

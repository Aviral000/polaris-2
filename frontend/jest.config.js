module.exports = {
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    transformIgnorePatterns: [
      '/node_modules/(?!(gsap)/)',
    ],
    moduleNameMapper: {
      '\\.(css|scss)$': 'identity-obj-proxy',
    },
    testEnvironment: 'jsdom',
};
  
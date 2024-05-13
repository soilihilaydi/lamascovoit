export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
 moduleNameMapper: {
  "^~/(.*)$": "<rootDir>/src/$1",
  '^@models/(.*)$': '<rootDir>/src/models/$1',
  '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
  '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1/' // Ajout du / manquant
},

  globals: {
    'process.env': {
      JWT_SECRET: 'testsecret',
    }
  },
  verbose: true
};
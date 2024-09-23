import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
  },
  test: {
    username: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASS,
    database: process.env.TEST_DB_NAME,
    host: process.env.TEST_DB_HOST,
    dialect: process.env.TEST_DB_DIALECT || 'mysql',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
  }
};

const environmentConfig = config[env];

const sequelize = new Sequelize(
  environmentConfig.database,
  environmentConfig.username,
  environmentConfig.password,
  {
    host: environmentConfig.host,
    dialect: environmentConfig.dialect,
    logging: env === 'test' ? false : console.log, 
    dialectOptions: {
      connectTimeout: 60000,
    },
  }
);

export default sequelize;






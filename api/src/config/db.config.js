import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development'; // Déterminez l'environnement actuel

const config = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    },
    test: {
        username: process.env.TEST_DB_USER,
        password: process.env.TEST_DB_PASS,
        database: process.env.TEST_DB_NAME,
        host: process.env.TEST_DB_HOST,
        dialect: process.env.TEST_DB_DIALECT,
        logging: console.log,
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    }
};

// Imprimez les valeurs d'environnement pour vérifier qu'elles sont correctement définies
console.log(process.env.TEST_DB_USER);
console.log(process.env.TEST_DB_PASS);
console.log(process.env.TEST_DB_NAME);
console.log(process.env.TEST_DB_HOST);
console.log(process.env.TEST_DB_DIALECT);

const environmentConfig = config[env];

const sequelize = new Sequelize(
    environmentConfig.database,
    environmentConfig.username,
    environmentConfig.password,
    {
       host: environmentConfig.host,
        dialect: environmentConfig.dialect,
        logging: environmentConfig.logging,
    }
);

export default sequelize;



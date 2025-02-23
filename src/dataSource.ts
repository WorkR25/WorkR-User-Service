import 'reflect-metadata';

import { DataSource } from 'typeorm';

import serverConfig from './configs/serverConfig';
import User from './models/User';

const { DB_HOST, DB_NAME, DB_PORT, DB_USERNAME, DB_PASSWORD } = serverConfig;

const dataSource = new DataSource({
    type: 'postgres',
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [User],
    migrations: ['dist/migrations/**/*.js'],
    synchronize: false,
    logging: true,
    ssl: {
        rejectUnauthorized: false
    },
    extra: {
        max: 10,
        idleTimeoutMillis: 15000,
        connectionTimeoutMillis: 2000,
    }
});

export default dataSource;
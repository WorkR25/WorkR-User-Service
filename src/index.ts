import fastifyCookie from '@fastify/cookie';
// import rateLimit from '@fastify/rate-limit';
import cors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import Fastify from 'fastify';

import app from './app';
import db from './configs/dbConfig';
import logger from './configs/loggerConfig';
import serverConfig from './configs/serverConfig';
import errorHandler from './utils/error/errorHandler';

const { PORT } = serverConfig;

const fastify = Fastify();

// fastify.register(rateLimit, {
//     max: 3,
//     timeWindow: '2 minutes',
// });

fastify.register(cors, {
    origin: ['https://www.workr.club'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
});

fastify.options('*', (_req, res) => {
    res.header('Access-Control-Allow-Origin', 'https://www.workr.club')
        .header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        .header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        .header('Access-Control-Allow-Credentials', 'true')
        .send();
});

fastify.register(fastifyCookie);

fastify.register(fastifyMultipart, {
    limits: {
        fileSize: 3 * 1024 * 1024
    }
});

fastify.register(app);

fastify.setErrorHandler(errorHandler);

fastify.listen({ port: PORT, host: '0.0.0.0' }, async (err) => {
    if(err) {
        fastify.log.error(err);
        process.exit(1);
    }
    await db.connect();
    logger.info(`Server started at PORT: ${PORT}`);
});
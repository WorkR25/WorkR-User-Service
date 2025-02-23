import fastifyCookie from '@fastify/cookie';
import cors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import Fastify from 'fastify';

import app from './app';
import db from './configs/dbConfig';
import logger from './configs/loggerConfig';
import serverConfig from './configs/serverConfig';
import errorHandler from './utils/error/errorHandler';

const { PORT } = serverConfig;

const fastify = Fastify({
    maxRequestsPerSocket: 1000
});

fastify.register(rateLimit, {
    max: 10,
    timeWindow: '2 minutes',
});

fastify.register(cors, {
    origin: ['https://www.workr.club', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-access-token'],
    credentials: true
});

fastify.register(fastifyCookie);

fastify.register(fastifyMultipart, {
    limits: {
        fileSize: 3 * 1024 * 1024
    }
});

fastify.register(app);

fastify.get('/', async (_req, res) => {
    return res.send({ msg: 'healthy '});
});

fastify.setErrorHandler(errorHandler);

fastify.listen({ port: PORT, host: '0.0.0.0' }, async (err) => {
    if(err) {
        console.log(err);
        fastify.log.error(err);
        process.exit(1);
    }
    await db.connect();
    logger.info(`Server started at PORT: ${PORT}`);
});
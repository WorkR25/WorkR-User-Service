import { FastifyInstance } from 'fastify';

import v1Route from './v1';

async function apiRoute(fastify: FastifyInstance) {
    fastify.register(v1Route, { prefix: '/v1' });
    fastify.get('/check', (_req, res) => {
        return res.send({ msg: 'alive' });
    });
}

export default apiRoute;
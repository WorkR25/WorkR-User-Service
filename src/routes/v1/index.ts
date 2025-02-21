import { FastifyInstance } from 'fastify';

import userRoute from './userRoute';

async function v1Route(fastify: FastifyInstance) {
    fastify.register(userRoute, { prefix: '/users' });
}

export default v1Route;
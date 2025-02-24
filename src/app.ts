import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import repositoryPlugin from './repositories';
import apiRoute from './routes';
import servicePlugin from './services';

async function app(fastify: FastifyInstance) {
    fastify.register(repositoryPlugin);
    fastify.register(servicePlugin);
    fastify.register(apiRoute, { prefix: '/api' });
}

export default fastifyPlugin(app);
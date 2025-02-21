import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import repositoryPlugin from './repositories';
import apiRoute from './routes';
import servicePlugin from './services';

async function app(fastify: FastifyInstance) {
    await fastify.register(repositoryPlugin);
    await fastify.register(servicePlugin);
    await fastify.register(apiRoute, { prefix: '/api' });
}

export default fastifyPlugin(app);
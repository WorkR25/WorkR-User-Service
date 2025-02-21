import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import UserRepository from './UserRepository';

async function repositoryPlugin(fastify: FastifyInstance) {
    fastify.decorate('userRepository', new UserRepository());
}

export default fastifyPlugin(repositoryPlugin);
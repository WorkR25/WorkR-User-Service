import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import UserService from './UserService';

async function servicePlugin(fastify: FastifyInstance) {
    fastify.decorate('userService', new UserService(fastify.userRepository));
}

export default fastifyPlugin(servicePlugin);
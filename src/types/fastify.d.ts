import UserRepository from '../repositories/UserRepository';
import UserService from '../services/UserService';

declare module 'fastify' {
    interface FastifyInstance {
        // Services
        userService: UserService;

        // Repsotories
        userRepository: UserRepository
    }

    interface FastifyRequest {
        user?: number
    }
}
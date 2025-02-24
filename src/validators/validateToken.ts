import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import BaseError from '../errors/BaseError';

export async function validateToken(this: FastifyInstance, req: FastifyRequest, res: FastifyReply) {
    try {
        console.log('prevalidation called og getUser route');
        const token = req.headers['x-access-token'] as string;
        const response = await this.userService.isAuthenticated(token);
        if(response) {
            req.user = response;
        }
    } catch (error) {
        console.log('printing from validate token', error);
        const err = error as BaseError;
        return res.status(502).send({ error: err });
    }
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhcmlqZWV0Z2FuZ3VsaTMyQGdtYWlsLmNvbSIsImlhdCI6MTc0MDMyNDU5OCwiZXhwIjoxNzQwNDEwOTk4fQ.ALKXlIFuWw03kIoRjoPLHY4LChGOFL4c68UfwouKDr0
import { FastifyReply,FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { ZodSchema } from 'zod';

import logger from '../configs/loggerConfig';
import ErrorResponse from '../utils/common/ErrorResponse';

export const validator = (schema: { body?: ZodSchema<unknown>, params?: ZodSchema<unknown>, query?: ZodSchema<unknown> }) => async (req: FastifyRequest, res: FastifyReply) => {
    try {
        schema.body?.parse(req.body);
        schema.params?.parse(req.params);
        schema.query?.parse(req.query);
    } catch (error) {
        logger.error('Invalid Request Structure');
        ErrorResponse.message = 'Invalid Request Structure';
        ErrorResponse.error = error;
        return res.status(StatusCodes.BAD_REQUEST).send(ErrorResponse);
    }
};
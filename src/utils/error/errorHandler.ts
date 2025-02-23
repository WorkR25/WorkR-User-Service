import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';

import BaseError from '../../errors/BaseError';
import RateLimitError from '../../errors/RateLimitError';
import ErrorResponse from '../common/ErrorResponse';

function isRateLimitError(err: Error) {
    return (err as RateLimitError).statusCode == 429;
}

function errorHandler(err: Error, _req: FastifyRequest, res: FastifyReply) {
    console.log(err);
    if(err instanceof BaseError) {
        ErrorResponse.message = err.message;
        ErrorResponse.error = err.details;
        return res.status(err.statusCode).send({ error: err });
    }

    if(isRateLimitError(err)) {
        ErrorResponse.message = 'Too many requests, retry after 2 minutes';
        ErrorResponse.error = err;
        return res.status(StatusCodes.TOO_MANY_REQUESTS).send(ErrorResponse);
    }
    
    ErrorResponse.error = err;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: err });
}

export default errorHandler;
import { StatusCodes } from 'http-status-codes';

import BaseError from './BaseError';

class BadRequestError extends BaseError {
    constructor(description: string, details: object) {
        super('This is a bad request', StatusCodes.BAD_REQUEST, description, details);
    }
}

export default BadRequestError;
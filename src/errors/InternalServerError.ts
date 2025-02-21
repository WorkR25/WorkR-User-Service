import { StatusCodes } from 'http-status-codes';

import BaseError from './BaseError';

class InternalServerError extends BaseError {
    constructor(description: string, details: unknown) {
        super('Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR, description, details);
    }
}

export default InternalServerError;
import { StatusCodes } from 'http-status-codes';

import BaseError from './BaseError';

class UnauthorizedError extends BaseError {
    constructor(description: string, details?: unknown) {
        super('UnAuthorized', StatusCodes.UNAUTHORIZED, description, details);
    }
}

export default UnauthorizedError;
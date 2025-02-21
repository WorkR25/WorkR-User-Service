import { StatusCodes } from 'http-status-codes';

import BaseError from './BaseError';

class NotFoundError extends BaseError {
    constructor(resourceName: string, resourceValue: string) {
        super('Resource Not Found', StatusCodes.NOT_FOUND, 'Not able to find the resource', {
            resourceName,
            resourceValue
        });
    }
}

export default NotFoundError;
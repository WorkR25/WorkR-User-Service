import { ResponseType } from '../../types/ResponseType';

const ErrorResponse: ResponseType = {
    success: false,
    message: 'Something Went Wrong',
    data: {},
    error: {}
};

export default ErrorResponse;
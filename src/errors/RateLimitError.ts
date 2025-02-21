class RateLimitError extends Error {
    statusCode: number;
    description: string;

    constructor(statusCode: number, description: string) {
        super(description);
        this.statusCode = statusCode;
    }
}

export default RateLimitError;
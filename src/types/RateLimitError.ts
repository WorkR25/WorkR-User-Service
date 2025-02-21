export interface RateLimitError extends Error {
    statusCode: 429,
    message: 'Too many requests, retry in 2 minutes'
}
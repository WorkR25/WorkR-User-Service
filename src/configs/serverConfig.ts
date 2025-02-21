import dotenv from 'dotenv';

dotenv.config();

export default {
    PORT: Number(process.env.PORT),
    DB_PORT: Number(process.env.DB_PORT),
    DB_NAME: process.env.DB_NAME,
    DB_HOST: process.env.DB_HOST,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    SALT_ROUNDS: Number(process.env.SALT_ROUNDS),
    JWT_SECRET: String(process.env.JWT_SECRET),
    JWT_EXPIRY: String(process.env.JWT_EXPIRY),
    AWS_ACCESS_KEY_ID: String(process.env.AWS_ACCESS_KEY_ID),
    AWS_SECRET_ACCESS_KEY: String(process.env.AWS_SECRET_ACCESS_KEY),
    AWS_REGION: String(process.env.AWS_REGION),
    AWS_S3_BUCKET_NAME: String(process.env.AWS_S3_BUCKET_NAME)
};
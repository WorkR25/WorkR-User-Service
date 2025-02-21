import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import serverConfig from '../../configs/serverConfig';
import { JwtTokenInput } from '../../types/JwtTokenInput';
import { UserTokenPayload } from '../../types/UserTokenPayload';

const { JWT_EXPIRY, JWT_SECRET, SALT_ROUNDS } = serverConfig;

async function checkPassword(plainPassword: string, encryptedPassword: string) {
    try {
        return await bcrypt.compare(plainPassword, encryptedPassword);
    } catch (error) {
        throw error;
    }
}

async function hashPassword(plainPassword: string) {
    const encryptedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    return encryptedPassword;
}

function createToken(input: JwtTokenInput) {
    try {
        return jwt.sign(input, JWT_SECRET, { expiresIn: JWT_EXPIRY as string });
    } catch (error) {
        throw error;
    }
}

function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET) as UserTokenPayload;
    } catch (error) {
        throw error;
    }
}

export default {
    checkPassword,
    createToken,
    verifyToken,
    hashPassword
};
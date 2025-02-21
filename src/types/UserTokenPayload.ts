import { JwtPayload } from 'jsonwebtoken';

export interface UserTokenPayload extends JwtPayload {
    id: number
    email: string
    iat: number
    exp: number
}
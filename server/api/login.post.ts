import { account } from '../db/schema';
import { authDb } from '../db/connections';
import { eq } from 'drizzle-orm';
import { calculateSRP6Verifier } from "../utils/password";
import { loginAccount } from '@/shared/validation';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const parseResult = loginAccount.safeParse(body)
    if (!parseResult.success) {
        return failure(z.prettifyError(parseResult.error), 400);
    }
    const password = parseResult.data.password as string;
    const username = parseResult.data.username as string;
    const users = await authDb.select().from(account).where(eq(account.username, username));
    if (users.length <= 0) {
        return failure("账号不存在", 401);
    }
    const user = users[0];
    if (!user) {
        return failure("账号不存在", 401);
    }
    const verifier = calculateSRP6Verifier(user.username as string, password, user.salt as unknown as Buffer);
    if (Buffer.compare(verifier, user.verifier as unknown as Buffer) !== 0) {
        return failure("密码错误", 401);
    }
    const loginUser = {
        id: user.id,
        username: user.username,
        email: user.email
    }
    const token: string = await jwt.sign(loginUser, Buffer.from(user.salt).toString('hex'), {
        algorithm: 'HS256',
        expiresIn: '7d'
    });
    event.node.res.setHeader('Set-Cookie', `AuthToken=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}`);
    return success({
        token: token
    });
})
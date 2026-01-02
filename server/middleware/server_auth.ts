import jwt from 'jsonwebtoken';
import { account } from '../db/schema';
import { authDb } from '../utils/auth_db';
import { eq } from 'drizzle-orm';
const ignoreUrls = ['/api/login', '/api/register'];
export default defineEventHandler(async (event) => {
    if (ignoreUrls.includes(event.path)) {
        return;
    }
    if (!event.path.startsWith('/api/')) {
        return;
    }
    const token = getHeader(event, 'Authorization')?.split('Bearer ')[1] || getCookie(event, 'AuthToken');
    console.log('Auth Token:', token)
    if (!token) {
        return failure("认证信息为空", 401);
    }
    const loginUser = jwt.decode(token);
    if (!loginUser) {
        return failure("认证token解析失败", 401);
    }
    const users = await authDb.select().from(account).where(eq(account.username, loginUser.username));
    if (users.length <= 0) {
        return failure("用户不存在", 401);
    }
    const user = users[0];
    if (!user) {
        return failure("用户不存在", 401);
    }
    try {
        const verify = jwt.verify(token, Buffer.from(user.salt).toString('hex'), { algorithm: ['HS256'] });
        event.context.authUser = verify;
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return failure("认证失败", 401);
        } else {
            return failure("系统繁忙", 500);
        }
    }
})
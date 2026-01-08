const config = useRuntimeConfig();
import { account } from '../db/schema';
import { authDb } from '../db/connections';
import { eq } from 'drizzle-orm';
import { getRegistrationData } from "../utils/password";
import { success, failure } from '../utils/base_response';
import { registerAccount } from '@/shared/validation';
import { z } from 'zod';
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const parseResult = registerAccount.safeParse(body)
    if (!parseResult.success) {
        return failure(z.prettifyError(parseResult.error), 400);
    }
    const password = parseResult.data.password as string;
    const username = parseResult.data.username as string;
    const email = parseResult.data.email as string;
    const users = await authDb.select().from(account).where(eq(account.username, username));
    if (users.length > 0) {
        return failure("账号已存在", 409);
    }
    const [salt, verifier] = getRegistrationData(username, password);
    await authDb.insert(account).values({
        username: username,
        email: email,
        salt: salt,
        verifier: verifier
    });
    return success({ message: "用户注册成功" });
})
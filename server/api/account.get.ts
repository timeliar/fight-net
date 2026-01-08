import { account } from "../db/schema";
import { authDb } from "../db/connections";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const authUser = event.context.authUser;
    const users = await authDb.select().from(account).where(eq(account.username, authUser.username));
    if (users.length <= 0) {
        return failure("信息不存在", 401);
    }
    const user = users[0];
    if (!user) {
        return failure("信息不存在", 401);
    }
    return success({
        id: user.id,
        username: user.username,
        email: user.email,
        locked: user.locked,
        locale: user.locale,
        expansion: user.expansion,
        online: user.online,
        last_login: user.last_login,
        flag: user.Flags
    })
})
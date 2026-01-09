
import { realmlist, characters } from '../db/schema';
import { authDb, charactersDb } from '../db/connections';
import { parseMoney } from '@/shared/formats';

import { eq, and } from 'drizzle-orm';
export default defineEventHandler(async (event) => {
    const authUser = event.context.authUser;
    const characterList = await charactersDb.select().from(characters).where(eq(characters.account, authUser?.id));

    const resCharList = [];
    for (let i in characterList) {
        let charac = characterList[i];
        resCharList.push({
            guid: charac?.guid,
            name: charac?.name,
            race: charac?.race,
            class: charac?.class,
            gender: charac?.gender,
            level: charac?.level,
            xp: charac?.xp,
            moneyRaw: charac?.money,
            money: parseMoney(charac?.money || 0),
            playerFlags: charac?.playerFlags,
            online: charac?.online,
            health: charac?.health,
        })
    }
    return success({ characters: resCharList });
})
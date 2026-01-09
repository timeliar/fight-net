
import { realmlist, characters } from '../../db/schema';
import { authDb, charactersDb } from '../../db/connections';
import { parseMoney } from '@/shared/formats';

import { eq, and, count, gt, like } from 'drizzle-orm';
export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    console.log(JSON.stringify(query));
    const page = parseInt(query.page as string, 10) || 1;
    const size = parseInt(query.size as string, 10) || 10;
    const limit = Math.max(1, Math.min(size, 50));
    const offset = (Math.max(page, 1) - 1) * limit;
    const andCondition = [gt(characters.guid, 0)];
    if (query.nameQuery) {
        andCondition.push(like(characters.name, `%${query.nameQuery}%`));
    }
    if (query.online == 'true') {
        andCondition.push(eq(characters.online, 1));
    }
    const totalCountResult = await charactersDb.select({ count: count() }).from(characters).where(and(...andCondition));
    const totalCount = totalCountResult[0]?.count || 0;
    if (totalCount <= 0) {
        return success({ characters: [], total: 0 });
    }
    const characterList = await charactersDb.select({
        guid: characters.guid,
        name: characters.name,
        race: characters.race,
        class: characters.class,
        gender: characters.gender,
        level: characters.level,
        xp: characters.xp,
        money: characters.money,
        playerFlags: characters.playerFlags,
        online: characters.online,
        health: characters.health
    })
        .from(characters).where(and(...andCondition)).orderBy(characters.guid).limit(limit).offset(offset);

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
    return success({ characters: resCharList, total: totalCount });
})

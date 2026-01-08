
import { characters, itemTemplate, itemTemplateLocale } from '../../../db/schema';
import { charactersDb, worldDb } from '../../../db/connections';

import { eq, and, inArray } from 'drizzle-orm';
export default defineEventHandler(async (event) => {
    const authUser = event.context.authUser;
    const characterId = parseInt(getRouterParam(event, 'id') as string, 10);
    if (Number.isNaN(characterId) || characterId <= 0) {
        return failure("角色UD非法", 401);
    }
    console.log('Fetching character equriments:', characterId, 'and user ID:', authUser?.id);
    const characterList = await charactersDb.select().from(characters).where(
        and(
            eq(characters.account, authUser?.id),
            eq(characters.guid, characterId)
        )
    );
    if (characterList.length <= 0) {
        return failure("角色不存在", 401);
    }
    const selectedCharacter = characterList[0];
    if (selectedCharacter == null) {
        return failure("角色不存在", 401);
    }
    const equipmentCache = selectedCharacter.equipmentCache as string;
    const equipmentEntries = equipmentCache.split(" ");
    const validEquIds = [];
    for (let equId of equipmentEntries) {
        let equIdInt = parseInt(equId, 10);
        if (!Number.isNaN(equIdInt) && equIdInt > 0) {
            validEquIds.push(equIdInt);
        }
    }
    const items = await worldDb.select().from(itemTemplate).where(
        and(
            inArray(itemTemplate.entry, validEquIds)
        )
    );
    const itemsMap = new Map(items.map(obj => [obj.entry, obj] as const));

    const itemsZhCN = await worldDb.select().from(itemTemplateLocale).where(
        and(
            eq(itemTemplateLocale.locale, "zhCN"),
            inArray(itemTemplateLocale.ID, validEquIds)
        )
    );
    const itemsZhCNMap = new Map(itemsZhCN.map(obj => [obj.ID, obj] as const));
    const resultList = [];
    for (let i in equipmentEntries) {
        let eqV = equipmentEntries[i] as string;
        let equIdInt = parseInt(eqV, 10);
        if (!Number.isNaN(equIdInt) && equIdInt > 0) {
            const item = itemsMap.get(equIdInt);
            const itemZhCN = itemsZhCNMap.get(equIdInt);
            if (item && itemZhCN) {
                resultList.push({
                    index: parseInt(i, 10),
                    entry: equIdInt,
                    name: item.name,
                    zhCNName: itemZhCN.name,
                    class: item.class,
                    quality: item.Quality
                })
            }
        }
    }
    return success({ equipments: resultList });
})
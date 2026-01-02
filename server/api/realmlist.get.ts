import { realmlist, realmcharacters } from '../db/schema';
import { authDb } from '../utils/auth_db';
const config = useRuntimeConfig();
import { eq, and } from 'drizzle-orm';
export default defineEventHandler(async (event) => {
    const authUser = event.context.authUser;
    console.log("Fetching realms for user:", authUser);
    const realms = await authDb.select().from(realmlist);
    const resRealms = realms.map(async realm => {
        const numChars = await authDb.select()
            .from(realmcharacters)
            .where(
                and(
                    eq(realmcharacters.realmid, realm.id),
                    eq(realmcharacters.acctid, authUser.id)
                )
            );
        console.log("NumChars fetched for realm", realm.id, "and user", authUser.id, ":", numChars);
        const num = numChars[0]?.numchars || 0;
        const rates = {
            money: config.realmRateMoney,
            xpQuest: config.realmRateXpQuest,
            xpQuestDf: config.realmRateXpQuestDf,
            xpExplore: config.realmRateXpExplore,
            honor: config.realmRateHonor,
            health: config.realmRateHealth,
            mana: config.realmRateMana,
            rageIncome: config.realmRateRageIncome,
            runicPowerIncome: config.realmRateRunicPowerIncome,
            focus: config.realmRateFocus,
            energy: config.realmRateEnergy,
            loyalty: config.realmRateLoyalty,
            dropItemUncommon: config.realmRateDropItemUncommon,
            dropItemRare: config.realmRateDropItemRare,
            itemEpic: config.realmRateItemEpic,
            itemLenendary: config.realmRateItemLenendary,
            dropMoney: config.realmRateDropMoney,
        }
        return {
            id: realm.id,
            name: realm.name,
            address: realm.address,
            port: realm.port,
            icon: realm.icon,
            timezone: realm.timezone,
            allowedSecurityLevel: realm.allowedSecurityLevel,
            population: realm.population,
            gamebuild: realm.gamebuild,
            numCharacters: num,
            rates: rates
        }
    });
    const resRealmsAwait = await Promise.all(resRealms);
    return resRealmsAwait;
})
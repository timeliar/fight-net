
import { realmlist, characters } from '../../../db/schema';
import { authDb, charactersDb } from '../../../utils/auth_db';

import { eq, and } from 'drizzle-orm';
export default defineEventHandler(async (event) => {
    const authUser = event.context.authUser;
    const realmId = getRouterParam(event, 'id');
    console.log('Fetching characters for realm ID:', realmId, 'and user ID:', authUser?.id);
    const characterList = await charactersDb.select().from(characters).where(eq(characters.account, authUser?.id));
    return success({ characters: characterList });
})
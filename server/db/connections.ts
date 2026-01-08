const config = useRuntimeConfig();

import { drizzle } from "drizzle-orm/mysql2";
// You can specify any property from the mysql2 connection options
export const authDb = drizzle({
    connection: {
        uri: config.authDbUri
    }
});

export const charactersDb = drizzle({
    connection: {
        uri: config.charactersDbUri
    }
});

export const worldDb = drizzle({
    connection: {
        uri: config.worldDbUri
    }
});
import { db } from "./index.js";

const config_db = {
    mysql: {
        client: 'mysql',
        connection: {
            ...db
        },
        pool: { min: 0, max: 7 
        }
    },
    sqlite3: {
        client: 'sqlite3',
        connection: {
            filename: "./DB/ecommerce.sqlite"
        },
        useNullAsDefault: true,
        pool: { min: 0, max: 7 }
    }
}


export {config_db};



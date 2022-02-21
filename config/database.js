import knex from "knex";
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

class Database {
    static clientMysql;
    static clientSqlite3;

    constructor(knex_options) {
        console.log(knex_options.client)
        if (knex_options.client === 'mysql') {
            if (Database.clientMysql) {
                //console.log(Database.client)
                this.clientMysql = Database.clientMysql;
            } else {
                Database.clientMysql = knex(knex_options);
                this.clientMysql = Database.clientMysql;
            }
        } else {
            if (Database.clientSqlite3) {
                //console.log(Database. clientSqlite3)
                this.clientSqlite3 = Database.clientSqlite3;
            } else {
                Database.clientSqlite3 = knex(knex_options);
                this.clientSqlite3 = Database.clientSqlite3;
            }
        }
    }
}


export {config_db, Database};



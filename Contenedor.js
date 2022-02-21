import fs, { stat } from 'node:fs'
import knex from "knex";


class Database {
    static client;
    constructor(knex_options) {
        if (Database.client) {
            //console.log(Database.client)
            this.client = Database.client;
        } else {
            Database.client = knex(knex_options);
            this.client = Database.client;
        }
    }
}

class Contenedor {



    static db_knex

    constructor(knex_options, table_name, fileName) {

        this.fileName = fileName
        this.knex_options = knex_options
        this.table_name = table_name

        this.db_knex = new Database(knex_options).client

        //this.createTableProducts()
        //this.createTableMessages()
    }

    insert = async (table_name, data) => {
        try {
            let response = {}
            let existsTable = await this.db_knex.schema.hasTable(table_name);
            if (existsTable) {
                response = await this.db_knex.from(table_name).insert(data);
                //console.log(response);
            } else {
                console.log("TABLE DONT EXISTS " + table_name)
            }

        } catch (error) {
            console.log(error);
        }
    }

    async createTableProducts() {
        try {
            let existeTabla = await this.db_knex.schema.hasTable("products");
            if (!existeTabla) {
                await this.db_knex.schema.createTable("products", table => {
                    table.bigincrements("id").primary(),
                        table.string("title"),
                        table.float("price"),
                        table.string("thumbnail")
                });
                //console.table(await this.db_knex.from("products"))
            } else {
                console.log(`Esta tabla ya existe: products`);
                //console.table(await this.db_knex.from("products"))
            }
        } catch (error) {
            console.log(error);
        }
    }

    async createTableMessages() {
        try {
            let existeTabla = await this.db_knex.schema.hasTable("messages");
            if (!existeTabla) {
                await this.db_knex.schema.createTable("messages", table => {
                    table.increments("id").primary(),
                        table.string("author"),
                        table.string("date"),
                        table.string("text")
                });
                //console.table(await this.db_knex.from("messages"))
            } else {
                console.log(`Esta tabla ya existe: messages`);
                //console.table(await this.db_knex.from("messages"))
            }
        } catch (error) {
            console.log(error);
        }
    }





    /**
    * Métodoque busca el id máximo en el arhivo indicado.
    * @returns 
    */
    async getMaxid() {
        try {
            let max_id = await this.db_knex.from(this.table_name).max('id')
            return Object.values(max_id[0])[0]

        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Métodoque recibe un objeto, lo guarda en el archivo indicado y retorna el id asignado.
     * @param {*} obj 
     * @returns 
     */
    async save(obj) {

        try {
            let max_id = await this.getMaxid()
            obj.id = Number(max_id) + 1
            await this.insert(this.table_name, obj)
            console.table(await this.db_knex.from(this.table_name))
            return max_id + 1

        } catch (error) {
            console.log("Error en save method: " + error)
        }

    }

    /**
     * Métodoque recibe un ID y devuelve el objeto con ese ID o null si no está.
     * @param {*} id 
     * @returns 
     */
    async getById(id) {
        try {
            let res = await this.db_knex.from(this.table_name).where('id', id)
            return res.length ? res[0] : null

        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Método que retorna un array con los objetos presentese en el archivo indicado.
     * @returns 
     */
    async getAll() {
        try {
            let res = await this.db_knex.from(this.table_name)
            return res

        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Método que elimina del archivo el objeto indicado en el parametro ID
     * @param {*} id 
     */
    async deleteById(id) {

        try {
            let response = await this.db_knex.from(this.table_name).where("id", "=", id).del()
            //console.table(await this.db_knex.from(this.table_name))
            return response

        } catch (error) {
            console.log(error)
        }

    }

    /**
     * Método que elimina todos los objetos presentes en el archivo.
     */
    async deleteAll() {
        try {
            let response = await this.db_knex.from(this.table_name).del()
            //console.table(await this.db_knex.from(this.table_name))
            return response
        } catch (error) {
            console.log(error)
        }

    }

    async updateById(id, prod) {
        try {
            let response = await this.db_knex.from(this.table_name).where("id", "=", id).update(prod)
            console.table(await this.db_knex.from(this.table_name))
            return response
        } catch (error) {
            console.log(error)
        }
    }

}

export { Contenedor }

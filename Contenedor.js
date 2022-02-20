import fs, { stat } from 'node:fs'

class Contenedor {

    constructor(fileName) {
        this.fileName = fileName
    }

    /**
     * Métodoque busca el id máximo en el arhivo indicado.
     * @returns 
     */
    async getMaxid(){
        try {
            const stats = await fs.promises.stat(this.fileName)
            let res = 0

            if(stats.size){
                const productos = await this.getAll()
                // Initial values object with id:0 for empty array case.
                const max = productos.reduce((a,b) => a.id > b.id ? a:b, {id: 0} )
                res = max.id
            } else {
                console.log("getMaxId: ARCHIVO VACIO")
            }
            return res

        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Métodoque recibe un objeto, lo guarda en el archivo indicado y retorna el id asignado.
     * @param {*} obj 
     * @returns 
     */
    async save( obj ) {

        try {
            const productos = await this.getAll()
            const max = await this.getMaxid()
            productos.push({...obj, id: max + 1})
            await fs.promises.writeFile(this.fileName, JSON.stringify(productos, null, 2))
            return max + 1

        } catch (error) {
            console.log("Error en save method: " + error)
        }
        
    }

    /**
     * Métodoque recibe un ID y devuelve el objeto con ese ID o null si no está.
     * @param {*} id 
     * @returns 
     */
    async getById( id ) {
        try {
            const stats = await fs.promises.stat(this.fileName)
            let res = null

            if(stats.size) {
                const productos = await this.getAll()
                const prod = productos.find( prod => prod.id === id)
                prod ? res = prod: res = null
            } else {
                console.log("getById: ARCHIVO VACIO")
            }
            return res
            
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
            const stats = await fs.promises.stat(this.fileName)
            let res = []

            if( stats.size ) {
                res = JSON.parse( await fs.promises.readFile(this.fileName, 'utf-8'))
            } else {
                console.log("getAll: ARCHIVO VACIO")
            }

            return res

        } catch (error) {
            console.log(error)            
        }
    }

    /**
     * Método que elimina del archivo el objeto indicado en el parametro ID
     * @param {*} id 
     */
    async deleteById( id ) {

        try {
            const productos = await this.getAll()
            await fs.promises.writeFile(this.fileName, JSON.stringify(productos.filter( prod => prod.id !== id), null, 2))
                        
        } catch (error) {
            console.log(error)
        }

    }

    /**
     * Método que elimina todos los objetos presentes en el archivo.
     */
    async deleteAll() {
        try {
            await fs.promises.writeFile(this.fileName, JSON.stringify([], null, 2))            
        } catch (error) {
            console.log(error)
        }

    }

    async updateById(id, prod) {
        try {
            const productos = await this.getAll()
            let index = productos.findIndex(prod => prod.id == id)
            if ( index >= 0) {
                prod.id = id
                productos[index] = prod
                await fs.promises.writeFile(this.fileName, JSON.stringify(productos))
            }  
        } catch (error) {
            console.log(error)   
        }
    }

}

export { Contenedor }

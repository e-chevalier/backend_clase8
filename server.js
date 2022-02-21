import express from 'express'
import cors from 'cors'
import { Contenedor } from './Contenedor.js'
import { Server as HttpServer } from 'http'
import { Server as IOServer } from 'socket.io'
import {config} from './config/index.js'
import { config_db } from './config/database.js'
import { engine } from 'express-handlebars';

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const PORT = config.port

// Middlewares
app.use(cors("*"));

// Settings
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(express.static('node_modules/bootstrap/dist'))

// defino el motor de plantilla
app.engine('.hbs', engine({
        extname: ".hbs",
        defaultLayout: 'index.hbs',
        layoutDir: "views/layouts/",
        partialsDir: "views/partials/"
    })
)

app.set('views', './views'); // especifica el directorio de vistas
app.set('view engine', '.hbs'); // registra el motor de plantillas

httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${httpServer.address().port}
                 Open link to http://127.0.0.1:${httpServer.address().port}`)
})

httpServer.on("error", error => console.log(`Error en servidor ${error}`))


const contenedorProductos = new Contenedor(config_db.mysql, "products")
await contenedorProductos.createTableProducts()
const products = await contenedorProductos.getAll()


const contenedorMensajes = new Contenedor(config_db.sqlite3, "messages")
await contenedorMensajes.createTableMessages()
const messages = await contenedorMensajes.getAll()


//console.log(await contenedorProductos.getById(2))
//console.log(await contenedorProductos.deleteById(2))
//await contenedorProductos.deleteAll()
//console.table(await contenedorProductos.getAll())
//await contenedorProductos.updateById(2, {price: 160})


/**
 *  Regular expression for check email
 */

const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

io.on('connection', (socket) => {
    // Emit all Products and Messages on connection.
    io.sockets.emit('products', products)
    io.sockets.emit('messages', messages)

    console.log('¡Nuevo cliente conectado!')  // - Pedido 1

    socket.on('newProduct', (prod) => {
       
        if (Object.keys(prod).length !== 0 && !Object.values(prod).includes('')) {
            contenedorProductos.save(prod)
            const max = products.reduce((a, b) => a.id > b.id ? a : b, { id: 0 })
            prod.id = max.id + 1
            products.push(prod)
            io.sockets.emit('products', products)
        }
    })

    socket.on('newMessage', (data) => {
        if (Object.keys(data).length !== 0 && re.test(data.author) && data.date !== '' && data.text !== '') {
            messages.push(data)
            contenedorMensajes.save(data)
            io.sockets.emit('messages', messages)
        }
    })

})


app.get('/', (req, res) => {
    res.render('main')
})














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


let dataMessages = [
    {
        author: "CharlyGarcia@gmail.com",
        date: "26/1/2022 08:33:30",
        text: "¡Hola! ¿Que tal?"
    },
    {
        author: "PedroAznar@hotmail.com",
        date: "26/1/2022 08:34:30",
        text: "¡Muy bien! ¿Y vos?"
    },
    {
        author: "GustavoCerati59@live.com",
        date: "26/1/2022 08:36:30",
        text: "¡Genial!"
    },
    {
        author: "echevalier@gmail.com",
        date: "26/1/2022 19:22:36",
        text: "Hola a todos!!!! ¿Como estan?"
    }
]

let dataProductos = [
    {
        title: "Cereza",
        price: "124.5",
        thumbnail: "https://cdn3.iconfinder.com/data/icons/fruits-52/150/icon_fruit_cerejas-128.png",
    },
    {
        title: "Manzana",
        price: "125.0",
        thumbnail: "https://cdn3.iconfinder.com/data/icons/fruits-52/150/icon_fruit_maca-128.png",
    },
    {
        title: "Frutilla",
        price: "14.5",
        thumbnail: "https://cdn3.iconfinder.com/data/icons/fruits-52/150/icon_fruit_morango-128.png",
    },
    {
        title: "Banana",
        price: "714.5",
        thumbnail: "https://cdn3.iconfinder.com/data/icons/fruits-52/150/icon_fruit_banana-128.png",
    },

    {
        title: "Uvas",
        price: "124.5",
        thumbnail: "https://cdn3.iconfinder.com/data/icons/fruits-52/150/icon_fruit_uvas-128.png",
    },
    {
        title: "Palta",
        price: "124.5",
        thumbnail: "https://cdn3.iconfinder.com/data/icons/fruits-52/150/icon_fruit_abacate-128.png",
    },
    {
        title: "Pera",
        price: "124.5",
        thumbnail: "https://cdn3.iconfinder.com/data/icons/fruits-52/150/icon_fruit_pera-128.png",
    },
    {
        title: "Limon",
        price: "80.05",
        thumbnail: "https://cdn3.iconfinder.com/data/icons/fruits-52/150/icon_fruit_limao-128.png",
    },
    {
        title: "Sandia",
        price: "600",
        thumbnail: "https://cdn3.iconfinder.com/data/icons/fruits-52/150/icon_fruit_melancia-128.png",
    },
    {
        title: "Anana",
        price: "500.05",
        thumbnail: "https://cdn3.iconfinder.com/data/icons/fruits-52/150/icon_fruit_abacaxi-128.png",
    },
    {
        title: "Maracuya",
        price: "250",
        thumbnail: "https://cdn3.iconfinder.com/data/icons/fruits-52/150/icon_fruit_maracuja-128.png",
    },
    {
        title: "Tamarindo",
        price: "100",
        thumbnail: "https://cdn3.iconfinder.com/data/icons/fruits-52/150/icon_fruit_tamarindo-128.png",
    },
    {
        title: "Ciruela",
        price: "355",
        thumbnail: "https://cdn3.iconfinder.com/data/icons/fruits-52/150/icon_fruit_ameixa-128.png",
    }
]

const contenedorProductos = new Contenedor(config_db.sqlite3, "products")
await contenedorProductos.createTableProducts()
await contenedorProductos.insert('products', dataProductos)
const products = await contenedorProductos.getAll()
//console.log(await contenedorProductos.getById(2))
//console.log(await contenedorProductos.deleteById(2))


const contenedorMensajes = new Contenedor(config_db.sqlite3, "messages")
await contenedorMensajes.createTableMessages()
await contenedorMensajes.insert('messages', dataMessages)
const messages = await contenedorMensajes.getAll()

//productos.length = 0
//await contenedorProductos.deleteAll()
//console.table(await contenedorProductos.getAll())
//await contenedorProductos.updateById(2, {price: 160})


/*
const messages = [
    { author: "CharlyGarcia@gmail.com", date: "26/1/2022 08:33:30", text: "¡Hola! ¿Que tal?" },
    { author: "PedroAznar@hotmail.com", date: "26/1/2022 08:34:30", text: "¡Muy bien! ¿Y vos?" },
    { author: "GustavoCerati59@live.com", date: "26/1/2022 08:36:30", text: "¡Genial!" }
]
*/

/**
 * 
 */

const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

io.on('connection', (socket) => {
    // Emit all Products and Messages on connection.
    io.sockets.emit('products', products)
    io.sockets.emit('messages', messages)

    console.log('¡Nuevo cliente conectado!')  // - Pedido 1

    socket.on('newProduct', (prod) => {
        if (Object.keys(prod).length !== 0 && prod.title !== '' && prod.price !== '' && prod.thumbnail !== '') {
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














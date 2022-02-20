import express from 'express'
import { Contenedor } from './Contenedor.js'
import { Server as HttpServer } from 'http'
import { Server as IOServer } from 'socket.io'
//import Handlebars from 'handlebars'
import { engine } from 'express-handlebars';

//import path from 'path';
//const __dirname = path.resolve();

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const PORT = 8080

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


const contenedorProductos = new Contenedor('productos.txt')
const products = await contenedorProductos.getAll()
const contenedorMensajes = new Contenedor('mensajes.txt')
const messages = await contenedorMensajes.getAll()

//productos.length = 0

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
            const max = products.reduce((a, b) => a.id > b.id ? a : b, { id: 0 })
            prod.id = max.id + 1
            products.push(prod)
            contenedorProductos.save(prod)
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














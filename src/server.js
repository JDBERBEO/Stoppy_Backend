require('dotenv').config();
const express = require('express')
const SocketIO = require('socket.io')
const http = require('http')
const morgan = require('morgan');
const connect = require('./database/db');
const playerRouter = require('./routes/playerRoutes')

const port = 8000
const app = express()
const server = http.createServer(app)
const io = SocketIO(server, {
  cors: {
    origin: '*'
  }
})

app.use(express.json());
app.use(morgan("dev"));
app.use('/players', playerRouter)

io.on('connection', socket => {
socket.emit('welcome', { message: 'Bienvenido'})
socket.on('roundeOne', data => {
  console.log('data roundone', data)
})
})


connect ()
// app.get('/', () => {
//   console.log('hola mundo')
// })

server.listen(port, () => {
  console.log(`App running at http://localhost:${port}`)
})
const express = require('express')
const SocketIO = require('socket.io')
const http = require('http')

const port = 8000
const app = express()
const server = http.createServer(app)
const io = SocketIO(server, {
  cors: {
    origin: '*'
  }
})

//escuchar por los eventos 
io.on('connection', socket => {
socket.emit('welcome', { message: 'Bienvenido'})
})
app.get('/', () => {
  console.log('hola mundo')
})

server.listen(port, () => {
  console.log(`App running at http://localhost:${port}`)
})
require('dotenv').config();
const express = require('express')
const SocketIO = require('socket.io')
const http = require('http')
const morgan = require('morgan');
const connect = require('./database/db');
const playerRouter = require('./routes/playerRoutes')
const Game = require("./models/gameModel");
const { create, findById } = require('./models/gameModel');
const { Socket } = require('dgram');
const jwt = require("jsonwebtoken");

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

const id = 1
io.on('connection', socket => {

  // let newGameId = ""
socket.on('createGame', async({token}) => {
    console.log('token', token)
    const {userId} = jwt.verify(token, "" + process.env.SECRET)
    console.log('playerid', userId)
    const newGame = await Game.create({})
    newGame.players.push(userId)
    await newGame.save()
    console.log('newGame', newGame)
    const newGameId = newGame._id.toString()
    socket.join(newGameId)
    socket.emit('gameId', newGameId)
  }
)

socket.on('joinGame', (gameId) => {
  console.log('gameId', gameId)
  io.to(gameId).emit('joined')
  socket.join(gameId)
  //agregar un socket cpara hacer un push a la base de datos del player que se une
})



// console.log('newgame por fuera de creategame', newGame)
// socket.emit('gameId', {gameId: Date.now()})

// let gameId = ''
// socket.on('roundOne', async (data) => { 
//     try {
//       console.log('data', data)
//       const roundOne = await Round.create({data})
//       console.log('roundOne', roundOne)
//       roundOne.name.push(data.nameOne)
//       roundOne.place.push(data.placeOne)
//       roundOne.fruit.push(data.fruitOne)
//       roundOne.color.push(data.colorOne)
//       roundOne.object.push(data.objectOne)
//       console.log('roundOne luego del push', roundOne)
//       roundOne.save()
//       console.log('Gameid', roundOne._id)
//       gameId = roundOne._id
//     } catch (error) {
//       console.log(err.message);
//     }
// })

// socket.on('roundTwo', async (data) => { 
//   try {
//     const game = await Round.findById(gameId)
//     console.log('game', game)
//     game.name.push(data.nameTwo)
//     game.place.push(data.placeTwo)
//     game.fruit.push(data.fruitTwo)
//     game.color.push(data.colorTwo)
//     game.object.push(data.objectTwo)
//     console.log('game luego del push TWO', game)
//     game.save()
//   } catch (error) {
//     console.log(error.message);
//   }
// })

// socket.on('roundThree', async (data) => { 
//   try {
//     const game = await Round.findById(gameId)
//     console.log('game', game)
//     game.name.push(data.nameThree)
//     game.place.push(data.placeThree)
//     game.fruit.push(data.fruitThree)
//     game.color.push(data.colorThree)
//     game.object.push(data.objectThree)
//     console.log('game luego del push THREE', game)
//     game.save()
//   } catch (error) {
//     console.log(error.message);
//   }
// })

// socket.on('roundFour', async (data) => { 
//   try {
//     const game = await Round.findById(gameId)
//     console.log('game', game)
//     game.name.push(data.nameFour)
//     game.place.push(data.placeFour)
//     game.fruit.push(data.fruitFour)
//     game.color.push(data.colorFour)
//     game.object.push(data.objectFour)
//     console.log('game luego del push FOUR', game)
//     game.save()
//   } catch (error) {
//     console.log(error.message);
//   }
// })

// socket.on('roundFive', async (data) => { 
//   try {
//     const game = await Round.findById(gameId)
//     console.log('game', game)
//     game.name.push(data.nameFive)
//     game.place.push(data.placeFive)
//     game.fruit.push(data.fruitFive)
//     game.color.push(data.colorFive)
//     game.object.push(data.objectFive)
//     console.log('game luego del push Five', game)
//     game.save()
//   } catch (error) {
//     console.log(error.message);
//   }
// })

})


connect ()
// app.get('/', () => {
//   console.log('hola mundo')
// })

server.listen(port, () => {
  console.log(`App running at http://localhost:${port}`)
})
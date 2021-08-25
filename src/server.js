require('dotenv').config();
const express = require('express')
const SocketIO = require('./utils/socket')
const http = require('http')
const morgan = require('morgan');
const connect = require('./database/db');
const playerRouter = require('./routes/playerRoutes')
const gameRouter = require('./routes/gameRoutes')
const Game = require("./models/gameModel");
const Player = require('./models/playerModel')
const jwt = require("jsonwebtoken");
const { Socket } = require('dgram');

const port = 8000
const app = express()
const server = http.createServer(app)
SocketIO.init(server)
const io = SocketIO.getIO()

app.use(express.json());
app.use(morgan("dev"));
app.use('/players', playerRouter)
app.use('/games', gameRouter)


io.on('connection', socket => {

socket.on('createGame', async({token, randomlettersArray}, ) => {

    const {userId} = jwt.verify(token, "" + process.env.SECRET)
    // console.log('playerid', userId)
    const newGame = await Game.create({letters : randomlettersArray})
    newGame.players.push(userId)
    await newGame.save()
    console.log('newGame', newGame)
    const newGameId = newGame._id.toString()
    socket.join(newGameId)
    socket.emit('gameId', newGameId)
  }
)

socket.on('joinGame', (gameId) => {
  // console.log('gameId', gameId)
  
  socket.join(gameId)
})

socket.on('playerToken', async({token, gameId}) => {
  console.log('joingame token', token)
  const {userId} = jwt.verify(token, "" + process.env.SECRET)
  const game = await Game.findById(gameId)
  game.players.push(userId)
  await game.save()

  const updatedGame = await Game.findById(gameId).populate('players')
  console.log('gameplayers playetoken: ', updatedGame)
  io.to(gameId).emit('joined', updatedGame.players)
})

socket.on('rejoined', (gameId) => {
  console.log('llego rejoined')
  socket.join(gameId)
})

socket.on('round', async ({name, place, fruit, color, object, token, gameId, round }) => { 
  try {
    io.to(gameId).emit('stop')

    } catch (error) {
      console.log(error.message);
    }
})

socket.on('answers_not_submitted', async ({name, place, fruit, color, object, token, gameId, round})=> {
  console.log('round desde answers_not_submitted', round)
  const {userId} = jwt.verify(token, "" + process.env.SECRET)
    const player = await Player.findById(userId)

    // player.nameHeader.push(name) 
    // player.place.push(place)
    // player.fruit.push(fruit)
    // player.color.push(color)
    // player.object.push(object)

    player.nameHeader[round] = name
    player.place[round] = place
    player.fruit[round] = fruit
    player.color[round] = color
    player.object[round] = object
    
    player.markModified('nameHeader')
    player.markModified('place')
    player.markModified('fruit')
    player.markModified('color')
    player.markModified('object')
    player.save({ validateBeforeSave: false })
    .then(()=>{
      return Game.findById(gameId).populate("players")
    }).then((game) =>{
      io.to(gameId).emit('send_answers', ({game}))
      console.log('game desde answers not submitted', game)
    }).catch((error) =>{
      console.log('error catch', error)
    })
   
})

socket.on('startGame', (gameId) =>{
  console.log('startgame', gameId)
  io.to(gameId).emit('gameStarting')
})

})


connect ()
// app.get('/', () => {
//   console.log('hola mundo')
// })

server.listen(port, () => {
  console.log(`App running at http://localhost:${port}`)
})
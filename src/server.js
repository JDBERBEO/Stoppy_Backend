require('dotenv').config();
const express = require('express')
const SocketIO = require('socket.io')
const http = require('http')
const morgan = require('morgan');
const connect = require('./database/db');
const playerRouter = require('./routes/playerRoutes')
const Game = require("./models/gameModel");
const Player = require('./models/playerModel')
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


io.on('connection', socket => {

socket.on('createGame', async({token}) => {
    // console.log('token', token)
    const {userId} = jwt.verify(token, "" + process.env.SECRET)
    // console.log('playerid', userId)
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
  // console.log('gameId', gameId)
  io.to(gameId).emit('joined')
  socket.join(gameId)
})

socket.on('playerToken', async({token, gameId}) => {
  console.log('joingame token', token)
  const {userId} = jwt.verify(token, "" + process.env.SECRET)
  const game = await Game.findById(gameId)
  game.players.push(userId)
  await game.save()
  // console.log('Game', game)
})

socket.on('rejoined', (gameId) => {
  console.log('llego rejoined')
  socket.join(gameId)
})

socket.on('round', async ({name, place, fruit, color, object, token, gameId, round }) => { 
  try {
    // const {userId} = jwt.verify(token, "" + process.env.SECRET)
    // const player = await Player.findById(userId)
    
    // player.nameHeader[round] = name
    // player.place[round] = place
    // player.fruit[round] = fruit
    // player.color[round] = color
    // player.object[round] = object
    // player.save({ validateBeforeSave: false })
    // console.log('player desde round', player)
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
    
    player.save({ validateBeforeSave: false })
    player.markModified('nameHeader')
    player.markModified('place')
    player.markModified('fruit')
    player.markModified('color')
    player.markModified('object')
    // .then((player)=>{
    //   console.log('player desde then', player)
    // }).catch((error) =>{
    //   console.log('error catch', error)
    // })

    console.log('player desde anserw not submitted', player)
})

// socket.on('bring_all_answers', async ({gameId}) =>{

//   const game = await Game.findById(gameId).populate("players")

//   console.log('game desde bring all answers: ', game )
//   io.to(gameId).emit('send_answers', ({game}))
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
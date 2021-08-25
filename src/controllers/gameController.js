const Game = require("../models/gameModel");
const Player = require("../models/playerModel")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SocketIO = require('../utils/socket')



module.exports = {
  async showOne(req, res) {
    console.log('entro al controller')
    try {
      const { gameId } = req.params;
      console.log('gameid', gameId)
      const game = await Game.findById(gameId)
        .populate("players")
      res.status(200).json(game);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async addScore(req, res) {
    console.log('entro al controller de addscore')
    try {
      const { body } = req
      console.log('body gameId', body.gameId)
      console.log('body roundScore', body.roundScore)

      const integer = parseInt(body.roundScore);
      
      const playerBeingScored = await Player.findById(body.playerIdBeingScored)
      const game = await Game.findById(body.gameId)
      // console.log('game desde addscore controller', game)
      // console.log('playerBeingScored ANTES: ', playerBeingScored)

      playerBeingScored.ScorePerRound[body.round] += integer
      // console.log('player_Being_Scored.ScorePerRound[body.round]: ', playerBeingScored.ScorePerRound[body.round] )
      
      playerBeingScored.results[body.round] = playerBeingScored.results[body.round] + 1

      playerBeingScored.markModified('ScorePerRound')
      playerBeingScored.markModified('results')

      playerBeingScored.save({ validateBeforeSave: false })

      console.log('playerBeingScored.results[body.round]: ', playerBeingScored.results[body.round])
      console.log('game.players.length - 1', game.players.length - 1)
      const io = SocketIO.getIO()
      if (playerBeingScored.results[body.round] >= game.players.length - 1) {
          io.to(body.gameId).emit('scores', {round: body.round, playerId: body.playerIdBeingScored, scores: playerBeingScored.ScorePerRound})
      }

      console.log('playerBeingScored', playerBeingScored)
      res.status(200).json({ message: 'success' });
    } catch (err) {
      console.log('error: ', err)
      res.status(400).json({ message: err.message });
    }
  },
}

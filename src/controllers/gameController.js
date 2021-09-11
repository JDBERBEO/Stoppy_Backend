const Game = require("../models/gameModel");
const Player = require("../models/playerModel")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SocketIO = require('../utils/socket')



module.exports = {
  async showOne(req, res) {
    try {
      const { gameId } = req.params;
      const game = await Game.findById(gameId)
        .populate("players")
      res.status(200).json(game);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async addScore(req, res) {
    try {
      const { body } = req
      const integer = parseInt(body.roundScore);
      
      const playerBeingScored = await Player.findById(body.playerIdBeingScored)
      const game = await Game.findById(body.gameId)

      playerBeingScored.ScorePerRound[body.round] += integer      
      playerBeingScored.results[body.round] = playerBeingScored.results[body.round] + 1

      playerBeingScored.markModified('ScorePerRound')
      playerBeingScored.markModified('results')

      playerBeingScored.save({ validateBeforeSave: false })

      const io = SocketIO.getIO()
      if (playerBeingScored.results[body.round] >= game.players.length - 1) {
          io.to(body.gameId).emit('scores', {round: body.round, playerId: body.playerIdBeingScored, scores: playerBeingScored.ScorePerRound})
      }

      res.status(200).json({ message: 'success' });
    } catch (err) {
      console.log('error: ', err)
      res.status(400).json({ message: err.message });
    }
  },
}

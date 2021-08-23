const Game = require("../models/gameModel");
const Player = require("../models/playerModel")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { findById } = require("../models/gameModel");

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
      
      console.log('body', body)
      
      const playerBeingScored = await Player.findById(body.playerIdBeingScored)
      console.log('player_Being_Scored antes', playerBeingScored)
      playerBeingScored.ScorePerRound[body.round] += body.roundScore
      console.log('player_Being_Scored.ScorePerRound[body.round]: ', playerBeingScored.ScorePerRound[body.round] )
      playerBeingScored.save({ validateBeforeSave: false })
      //find del player
      //player.score += nuevo score que llega
      //save 
      console.log('playerBeingScored', playerBeingScored)
      res.status(200).json({ message: 'success' });
    } catch (err) {
      console.log('error: ', err)
      res.status(400).json({ message: err.message });
    }
  },
}
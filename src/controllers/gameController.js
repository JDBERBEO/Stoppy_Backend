const Game = require("../models/gameModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
      
      //push del score
      //save del score
      //gameid se hace el find by id y se saca el total de jugadores 
      // const totalRoundScore = 
      // roundScores / players.length
      // se puede hacer un update de la propiedad score o crear una nueva??
 
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
}
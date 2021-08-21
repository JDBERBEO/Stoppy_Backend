const Game = require("../models/gameModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
  async show(req, res) {
    try {
      const { gameId } = req.params;
      const game = await Game.findById(gameId)
        .populate("players")
      res.status(200).json(game);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
}
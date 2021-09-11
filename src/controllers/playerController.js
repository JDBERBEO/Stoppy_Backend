const Player= require("../models/playerModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
    async signup(req, res) {
      try {
        const { body } = req
        const player = await Player.create(body)
        
        const token = jwt.sign({ userId: player._id }, process.env.SECRET, {
          expiresIn: 60 * 60 * 24 * 365,
        });
        res.status(201).json({token});
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
      },
    async signin(req, res) {
      try {
        const { email, password } = req.body;
  
        const player = await Player.findOne({ email });
  
        if (!player) {
          throw new Error("Password or email invalid");
        }
  
        const isValid = await bcrypt.compare(password, player.password);
  
        if (!isValid) {
          throw new Error("Password or email invalid");
        }
  
        const token = jwt.sign({ userId: player._id }, process.env.SECRET, {
          expiresIn: 60 * 60 * 24 * 365,
        });
  
        res.status(201).json({token, playerId: player._id});
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
      },
}
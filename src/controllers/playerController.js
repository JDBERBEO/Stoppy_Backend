const Player= require("../models/playerModel");
// const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
    async signup(req, res) {
      try {
        const { body } = req
        const player = await Player.create(body)
        res.status(201).json('user created');
      } catch (error) {
        res.status(400).json({ message: err.message });
      }
      },
    async signin(req, res) {
      try {
        const { email, password } = req.body;
  
        const player = await Player.findOne({ email });
  
        if (!player) {
          throw new Error("Password or invalid email");
        }
  
        const isValid = await bcrypt.compare(password, player.password);
  
        if (!isValid) {
          throw new Error("Password or invalid email");
        }
  
        // const token = jwt.sign({ userId: roomie._id }, process.env.SECRET, {
        //   expiresIn: 60 * 60 * 24 * 365,
        // });
  
        res.status(201).json('user logged');
      } catch (error) {
        console.log("ERROR", error.message);
  
        res.status(400).json({ message: error.message });
      }
      },

}
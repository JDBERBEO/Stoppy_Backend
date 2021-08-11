const { Schema, model, models } = require("mongoose");

const playerSchema = new Schema( 
    {
    letter: {
    type: [String],
    },
    name: {
        type: [String],
    },
    place : {
      type: [String],
    },
    fruit: {
        type: [String],
    },
    color: {
        type: [String],
    },
    thing: {
        type: [String],
    },
    totalScorePerRound: {
        type: [Number]
    }
  })

  
const Game = model('Game', playerSchema)
module.exports = Game
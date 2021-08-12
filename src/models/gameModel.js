const { Schema, model, models } = require("mongoose");

const gameSchema = new Schema( 
    {
    players: [{type: Schema.Types.ObjectId, ref: "Player"}],
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
    object: {
        type: [String],
    },
    totalScorePerRound: {
        type: [Number]
    }
  })

  
const Game = model('Game', gameSchema)
module.exports = Game
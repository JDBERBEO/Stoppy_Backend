const { Schema, model, models } = require("mongoose");

const gameSchema = new Schema( 
    {
    players: [{type: Schema.Types.ObjectId, ref: "Player"}],
    letters: [String],
    results: [Number]
  })

  
const Game = model('Game', gameSchema)
module.exports = Game
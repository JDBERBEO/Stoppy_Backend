const { Schema, model, models } = require("mongoose");

const gameSchema = new Schema( 
    {
    players: [{type: Schema.Types.ObjectId, ref: "Player"}],

  })

  
const Game = model('Game', gameSchema)
module.exports = Game
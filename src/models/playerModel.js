const { Schema, model, models } = require("mongoose");
const bcrypt = require("bcrypt");
const passwordRegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

const playerSchema = new Schema( 
    {
      name: {
      type: String,
      required: true
    },
    email: {
        type: String,
        required: true,
        validate: [
          {
            async validator(email) {
              try {
                const player = await models.Player.findOne({email})
                return !player
              } catch (error) {
                return false
              }
            },
            message: 'email us already being used'
          }
        ]
    },
    password : {
      type: String,
      required: true, 
      match: [passwordRegExp, 'Invalid email or password'],
    },
    letter: {
      type: [String],
      },
      nameHeader: {
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

playerSchema.pre('save', async function () {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8)
  }
})
const Player = model('Player', playerSchema)
module.exports = Player
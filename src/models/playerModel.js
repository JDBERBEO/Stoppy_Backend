const { Schema, model, models } = require("mongoose");
const bcrypt = require("bcrypt");
const passwordRegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;


const playerSchema = new Schema( 
    {
      name: {
      type: String,
      required: true
    },
    email: {
        type: String,
        required: true,
        match: [emailRegex, "Invalid email or password"],
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
      ScorePerRound: {
          type: [Number],
      },
      totalscore: {
        type: Number
      }
  })

playerSchema.pre('save', async function () {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8)
  }
  
})
const Player = model('Player', playerSchema)
module.exports = Player
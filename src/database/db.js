const mongoose = require('mongoose');
function connect() {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/stoppy'
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  mongoose
    .connect(mongoURI, options)
    .then(() => {
      console.log('Connection established successfully')
    })
    .catch((error) => {
      console.log('Something went wrong', error)
    })
}

module.exports = connect;

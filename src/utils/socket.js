const SocketIO = require('socket.io')

module.exports = {
    init(server){
        this.io = SocketIO(server, {
            cors: {
              origin: '*'
            }
          })
    },
    getIO(){
        return this.io
    }
}
const { Server } = require('socket.io');
const { verifyAccessToken } = require('./utils/tokens');
const { sendMessage } = require('./services/chatService');

function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      socket.user = verifyAccessToken(token);
      next();
    } catch (_error) {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('chat:message', async (payload) => {
      try {
        const result = await sendMessage({
          userId: socket.user.sub,
          content: payload.content,
          conversationId: payload.conversationId,
        });
        socket.emit('chat:response', result);
      } catch (error) {
        socket.emit('chat:error', { message: error.message || 'Failed to process message' });
      }
    });
  });

  return io;
}

module.exports = initSocket;

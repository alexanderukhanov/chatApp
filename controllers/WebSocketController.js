const jwt = require('jsonwebtoken');
const services = require('../src/services/services');
const NewMessage = require('./NewMessage');
const users = new Map();
let savedMessages;

const showOnlineUsers = socket => {
  socket.server.sockets.emit(
    'users',
    [...users.values()].map(socket => socket.user)
  );
};

const middleWare = async (socket, next) => {
  try {
    const decoded = jwt.verify(
      socket.handshake.query.token,
      process.env.SECRET_KEY
    );
    const user = await services.findUserById(decoded.id);

    if (!user && user.isBanned) {
      return socket.disconnect();
    }

    socket.user = user;

    next();
  } catch (e) {
    return socket.disconnect();
  }
};

const connection = async socket => {
  if (users.get(socket.user.login)) {
    return socket.disconnect();
  }
  users.set(socket.user.login, socket);

  const usersToArray = [...users.values()];
  usersToArray.forEach(async socket => {
    if (socket.user.isAdmin) {
      socket.emit('allUsers', await services.getAllUsers());
      socket.emit('isAdmin', true);
    }
  });

  if (socket.user.isAdmin) {
    socket.on('mute', async muteLogin => {
      await services.updateBaseUsersToMuteAndUnmute(muteLogin, true);
      socket.server.sockets.emit('muteInfo', muteLogin);
    });

    socket.on('unMute', async unmuteLogin => {
      await services.updateBaseUsersToMuteAndUnmute(unmuteLogin);
      socket.server.sockets.emit('unmuteInfo', unmuteLogin);
    });

    socket.on('ban', async banLogin => {
      await services.updateBaseUsersToBanAndUnban(banLogin, true);
      socket.server.sockets.emit('banInfo', banLogin);
      const socketToBan = users.get(banLogin);

      if (socketToBan) {
        socket.to(socketToBan.id).emit('isYouBanned', true);
        socketToBan.disconnect();
      }
    });

    socket.on('unBan', async unbanLogin => {
      await services.updateBaseUsersToBanAndUnban(unbanLogin);
      socket.server.sockets.emit('unbanInfo', unbanLogin);
    });
  }

  socket.broadcast.emit('userEnter', socket.user.login);

  showOnlineUsers(socket);

  savedMessages = await services.messages();

  socket.emit('messages', savedMessages);

  socket.on('disconnect', () => {
    socket.broadcast.emit('userLeave', socket.user.login);
    users.delete(socket.user.login);
    showOnlineUsers(socket);
  });

  socket.on('newMessage', newMessage =>
    NewMessage(newMessage, savedMessages, socket)
  );
};

module.exports = {
  middleWare,
  connection,
};

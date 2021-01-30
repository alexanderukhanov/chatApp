const services = require('../src/services/services');
const MILLISECONDS = 15000;

const NewMessage = async (newMessage, savedMessages, socket) => {
  const thisLoginFromDB = await services.findUserByLogin(socket.user.login);
  if (thisLoginFromDB.isMuted) {
    return socket.emit('isThisUserMuted', true);
  }

  if (newMessage.length > 200) {
    return socket.emit('isInvalidMessage', true);
  }

  const messageByThisUser = await services.findLastMessageFromUser(
    socket.user.login
  );

  if (
    messageByThisUser &&
    Date.now() - messageByThisUser.createdDate < MILLISECONDS
  ) {
    return socket.emit('messageInterval', true);
  }

  const newMessageWithLogin = {
    login: socket.user.login,
    message: newMessage,
    color: socket.user.color,
    createdDate: Date.now(),
  };
  services.saveMessageToDB(newMessageWithLogin);

  savedMessages.unshift(newMessageWithLogin);
  socket.server.sockets.emit('messages', savedMessages);
};

module.exports = NewMessage;

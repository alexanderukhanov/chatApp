const ChatDB = require('../../models/ChatDB');
const MessagesDB = require('../../models/MessagesDB');

const getAllUsers = () => {
  return ChatDB.find({});
};
const updateBaseUsersToMuteAndUnmute = (login, isMuted = false) => {
  return ChatDB.updateOne({ login }, { isMuted });
};
const updateBaseUsersToBanAndUnban = (login, isBanned = false) => {
  return ChatDB.updateOne({ login }, { isBanned });
};
const messages = () =>
  MessagesDB.find({}, null, { limit: 10 }).sort({
    _id: -1,
  });
const findUserByLogin = login => ChatDB.findOne({ login });
const findUserById = _id => ChatDB.findOne({ _id });
const findLastMessageFromUser = login => {
  return MessagesDB.findOne({
    login,
  }).sort({ _id: -1 });
};
const saveMessageToDB = message => {
  MessagesDB(message).save();
};
const addNewUser = objUser => ChatDB(objUser).save();

module.exports = {
  getAllUsers,
  updateBaseUsersToMuteAndUnmute,
  updateBaseUsersToBanAndUnban,
  messages,
  findUserByLogin,
  findUserById,
  findLastMessageFromUser,
  saveMessageToDB,
  addNewUser,
};

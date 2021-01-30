import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useHistory } from 'react-router-dom';
import UserPanel from '../UserPanel/UserPanel';
import MessagesList from '../MessagesList/MessagesList';
import SendMessageFormAndLeaveChat from '../SendMessageFormAndLeaveChat/SendMessageFormAndLeaveChat';
import UsersOnline from '../UsersOnline/UsersOnline';

const withSocket = ComposedComponent => props => {
  const [socket, setSocket] = useState(null);
  const history = useHistory();

  useEffect(() => {
    let token = localStorage.getItem('id');

    if (!token) {
      history.push('/');
      return;
    }

    try {
      const socket = io.connect('ws://localhost:3001', {
        query: { token },
      });

      socket.on('disconnect', reason => {
        //debugger
        console.log(reason);
        history.push('/');
      });

      socket.on('isYouBanned', isYouBanned => {
        if (isYouBanned) {
          localStorage.clear();
          token = null;
          alert('You are banned');
          history.push('/');
        }
      });

      setSocket(socket);
    } catch (e) {
      console.log(e);
      debugger;
      history.push('/');
    }
  }, [history, setSocket]);

  if (!socket) {
    return 'Loading ...';
  }
  return <ComposedComponent {...props} socket={socket} />;
};

function Chat({ socket }) {
  const [userNameEnter, setUserNameEnter] = useState(null);
  const [userNameLeave, setUserNameLeave] = useState(null);
  const [userNameMuted, setUserNameMuted] = useState(null);
  const [userNameUnMuted, setUserNameUnMuted] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allUsers, setAllUsers] = useState(null);
  const [isThisUserMuted, setIsThisUserMuted] = useState(false);
  const [messageInfo, setMessageInfo] = useState(false);
  const [messageIntervalAlarm, setMessageIntervalAlarm] = useState(false);
  const [userNameBanned, setUserNameBanned] = useState(null);
  const [userNameUnbanned, setUserNameUnbanned] = useState(null);
  const history = useHistory();

  const sendMessage = e => {
    e.preventDefault();
    setNewMessage(document.forms.sendMessage.field.value);
    document.forms.sendMessage.field.value = '';
  };

  const ban = login => socket.emit('ban', login);

  const mute = login => socket.emit('mute', login);

  const unBan = login => socket.emit('unBan', login);

  const unMute = login => socket.emit('unMute', login);

  const leaveChat = () => {
    socket.disconnect();
    localStorage.clear();
  };

  const hideMessage = message => {
    setTimeout(() => {
      message(null);
    }, 5000);
  };

  useEffect(() => {
    socket.on('isDisconnected', reason => {
      //debugger
      console.log(reason);
      history.push('/');
      alert('You are disconnected');
    });

    socket.on('isAdmin', isAdmin => setIsAdmin(isAdmin));

    socket.on('allUsers', allUsers => {
      const sorterdUsers = allUsers.filter(user => user.isAdmin !== true);
      setAllUsers(sorterdUsers);
    });

    socket.on('userEnter', userEnter => {
      setUserNameEnter(userEnter);
      hideMessage(setUserNameEnter);
    });

    socket.on('userLeave', userLeave => {
      setUserNameLeave(userLeave);
      hideMessage(setUserNameLeave);
    });

    socket.on('muteInfo', muteInfo => {
      setUserNameMuted(muteInfo);
      hideMessage(setUserNameMuted);
    });

    socket.on('unmuteInfo', unmuteInfo => {
      setUserNameUnMuted(unmuteInfo);
      hideMessage(setUserNameUnMuted);
    });
    socket.on('banInfo', banInfo => {
      setUserNameBanned(banInfo);
      hideMessage(setUserNameBanned);
    });
    socket.on('unbanInfo', unbanInfo => {
      setUserNameUnbanned(unbanInfo);
      hideMessage(setUserNameUnbanned);
    });

    socket.on('isInvalidMessage', messageInfo => {
      setMessageInfo(messageInfo);
      hideMessage(setMessageInfo);
    });

    socket.on('isThisUserMuted', isThisUserMuted => {
      setIsThisUserMuted(isThisUserMuted);
      hideMessage(setIsThisUserMuted);
    });

    socket.on('users', users => setOnlineUsers(users));

    newMessage && socket.emit('newMessage', newMessage) && setNewMessage(null);

    socket.on('messages', messages => {
      setMessages(messages);
    });

    socket.on('messageInterval', messageInterval => {
      setMessageIntervalAlarm(messageInterval);
      hideMessage(setMessageIntervalAlarm);
    });
  }, [history, newMessage, socket, setAllUsers]);

  return (
    <>
      <div className="d-flex container">
        <MessagesList
          userNameEnter={userNameEnter}
          userNameLeave={userNameLeave}
          userNameMuted={userNameMuted}
          userNameUnMuted={userNameUnMuted}
          userNameBanned={userNameBanned}
          userNameUnbanned={userNameUnbanned}
          messageIntervalAlarm={messageIntervalAlarm}
          messageInfo={messageInfo}
          isThisUserMuted={isThisUserMuted}
          messages={messages}
        />
        <UsersOnline onlineUsers={onlineUsers} />
      </div>
      <SendMessageFormAndLeaveChat
        sendMessage={sendMessage}
        leaveChat={leaveChat}
      />
      {isAdmin && (
        <UserPanel
          allUsers={allUsers}
          ban={ban}
          mute={mute}
          unBan={unBan}
          unMute={unMute}
        />
      )}
    </>
  );
}

export default withSocket(Chat);

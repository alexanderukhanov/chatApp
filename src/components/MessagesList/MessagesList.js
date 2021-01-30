import Message from '../Message/Message';

export default function MessagesList(props) {
  const messageTemplate = (propsName, string) => {
    if (!propsName) {
      return <div>{string}</div>;
    }
    return (
      <div>
        <strong>{propsName} </strong>
        {string}
      </div>
    );
  };

  return (
    <div className="col-6 mt-3 messages">
      <h3>Сообщения</h3>
      <div id="all_mess">
        {props.userNameEnter &&
          messageTemplate(props.userNameEnter, 'join chat')}
        {props.userNameLeave &&
          messageTemplate(props.userNameLeave, 'leave chat')}
        {props.userNameMuted && messageTemplate(props.userNameMuted, 'muted')}
        {props.userNameUnMuted &&
          messageTemplate(props.userNameUnMuted, 'unmuted')}
        {props.userNameBanned &&
          messageTemplate(props.userNameBanned, 'banned')}
        {props.userNameUnbanned &&
          messageTemplate(props.userNameUnbanned, 'unbanned')}
        {props.messageIntervalAlarm &&
          messageTemplate(null, 'You can send message after 15 sec')}
        {props.messageInfo &&
          messageTemplate(null, 'Write message less than 200 characters')}
        {props.isThisUserMuted && messageTemplate(null, 'You muted')}
        {props.messages &&
          props.messages.map((message, i) => (
            <Message key={i} message={message} />
          ))}
      </div>
    </div>
  );
}

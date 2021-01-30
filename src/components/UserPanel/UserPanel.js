export default function UserPanel(props) {
  return (
    <div className="container admin">
      {props.allUsers &&
        props.allUsers.map((user, i) => (
          <div className="user" key={i}>
            <div> {user.login} </div>
            <button
              className="btn btn-primary myButton"
              onClick={props.ban.bind(null, user.login)}
            >
              Ban
            </button>
            <button
              className="btn btn-primary ml-2 myButton"
              onClick={props.mute.bind(null, user.login)}
            >
              Mute
            </button>
            <button
              className="btn btn-primary myButton"
              onClick={props.unBan.bind(null, user.login)}
            >
              Unban
            </button>
            <button
              className="btn btn-primary ml-2 myButton"
              onClick={props.unMute.bind(null, user.login)}
            >
              Unmute
            </button>
          </div>
        ))}
    </div>
  );
}

export default function UsersOnline(props) {
  return (
    <div className="col-6 mt-3 users">
      <h3>Пользователи</h3>
      {props.onlineUsers &&
        props.onlineUsers.map((user, i) => <div key={i}>{user.login}</div>)}
    </div>
  );
}

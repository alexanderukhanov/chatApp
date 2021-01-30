export default function Message(props) {
  return (
    <div
      style={{ color: props.message.color }}
      className="alert alert-primary"
      role="alert"
    >
      {new Date(props.message.createdDate)
        .toLocaleTimeString()
        .split(':', 2)
        .join(':')}{' '}
      {props.message.login}: {props.message.message}
    </div>
  );
}

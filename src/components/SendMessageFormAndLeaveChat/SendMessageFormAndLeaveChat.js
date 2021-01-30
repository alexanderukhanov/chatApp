export default function SendMessageFormAndLeaveChat(props) {
  return (
    <>
      <form
        className="input-group mt-3 textinput"
        name="sendMessage"
        onSubmit={props.sendMessage}
      >
        <input
          required
          type="text"
          className="form-control"
          placeholder="Enter message"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
          name="field"
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-secondary"
            type="submit"
            name="send"
          >
            Send
          </button>
        </div>
      </form>
      <div className=" mt-3 leave_button">
        <button
          type="button"
          className="btn btn-danger"
          onClick={props.leaveChat}
        >
          Leave chat
        </button>
      </div>
    </>
  );
}

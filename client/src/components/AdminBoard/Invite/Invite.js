import { inviteUser } from "../../../requests/invite";
import { useState } from "react";

// invite a client form in admin board
function Invite() {
  const [msg, setMsg] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const credentials = {
      email: formData.get("email"),
    };
    inviteUser(credentials)
      .then((res) => setMsg(res.data.message))
      .catch((err) => {
        setMsg(err.response.data.message);
      }); // catch any errors
  };
  return (
    <div className="invite-container">
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          type="username"
          name="email"
          placeholder="Client e-mail"
        />
        <input className="btn" type="submit" value="Send Invite" />
        {msg ? <div>{msg}</div> : null}
      </form>
    </div>
  );
}

export default Invite;

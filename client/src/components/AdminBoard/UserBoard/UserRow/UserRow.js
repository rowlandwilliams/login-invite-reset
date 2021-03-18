import "../styles.css";
import { sendPasswordInvite } from "../../../../requests/resetpassword";
import { Component } from "react";

// should probably go in a utils directory
function capitalize(str) {
  return str[0].toUpperCase() + str.substring(1);
}

// user row in admin board
class UserRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      msg: "Reset Password",
    };
    this.resetPasswordEmail = this.resetPasswordEmail.bind(this);
  }

  resetPasswordEmail() {
    this.setState({ loading: true, msg: "Loading" });
    const id = this.props.user.id,
      email = this.props.user.email;
    sendPasswordInvite(id, email)
      .then((res) => {
        this.setState({ loading: false, msg: "E-mail sent" });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ loading: false, msg: "Error" });
      });
  }

  render() {
    const { msg } = this.state;

    return (
      <div className="user-row">
        <span className="user-row-text">
          {capitalize(this.props.user.first_name) +
            " " +
            capitalize(this.props.user.last_name)}
        </span>
        <span className="user-row-text">{this.props.user.email}</span>
        <span className="user-row-text">
          <input
            className="btn reset-password"
            type="submit"
            value={msg}
            onClick={this.resetPasswordEmail}
          />
        </span>
      </div>
    );
  }
}

export default UserRow;

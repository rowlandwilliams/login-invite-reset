import { Session } from "../../requests/session";
import { withRouter } from "react-router-dom";
import { Component } from "react";
import "./styles.css";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const credentials = {
      username: formData.get("username"),
      password: formData.get("password"),
    };
    Session.create(credentials)
      .then((res) => {
        if (res.data.id) {
          // id only exists if auth
          this.props.onSignIn();
          this.props.history.push("/");
        }
      })
      .catch((err) => {
        this.setState({ error: err.response.data.message });
      });
  }

  render() {
    return (
      <div className="loginContainer">
        <div className="loginForm">
          <form onSubmit={this.handleSubmit}>
            <input
              className="input"
              type="username"
              name="username"
              placeholder="Username"
            />
            <input
              className="input"
              type="password"
              name="password"
              placeholder="Password"
            />
            <div className="errMessage">
              {this.state.error && (
                <p className="error"> {this.state.error} </p>
              )}
            </div>
            <div className="submitButton">
              <input className="btn" type="submit" value="Login" />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(SignIn);

import "./styles.css";
import React, { Component } from "react";
import { createSecretUser } from "../../requests/secretregister";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

class SecretRegisterForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      msg: null,
      success: null,
    };
  }

  handleSubmit(event) {
    const token = this.props.token;
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const credentials = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      password: formData.get("password"),
      password2: formData.get("confirmPassword"),
    };
    createSecretUser(credentials, token)
      .then((res) => {
        console.log(res.data);
        this.setState({ msg: res.data.message, success: res.data.success });
      })
      .catch((err) => {
        this.setState({ msg: err.response.data.message });
      });
  }

  handleSuccess() {
    this.props.history.push("/sign-in");
  }

  render() {
    const { msg, success } = this.state;

    if (success) {
      return (
        <div className="form-container">
          <p className="form-title">
            Account successfully created. <br />
            Please check your e-mail for confirmation.
          </p>
          <Link
            style={{ textDecoration: "none" }}
            to="/sign-in"
            className="btn"
          >
            Login
          </Link>
        </div>
      );
    }

    return (
      <div className="form-container">
        <div className="form-title">
          <div className="form-title header">Welcome to Flow</div>
          <div className="form-title text">{this.props.email}</div>
          <div className="form-title text">
            Please fill in your details below.
          </div>
        </div>
        <form className="form-form" onSubmit={this.handleSubmit}>
          <input
            className="input"
            type="username"
            name="firstName"
            placeholder="First name"
          />
          <input
            className="input"
            type="username"
            name="lastName"
            placeholder="Last name"
          />
          <input
            className="input"
            type="password"
            name="password"
            placeholder="Password"
            autocomplete="new-password"
          />
          <input
            className="input"
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
          />
          <div className="submitButton">
            <input className="btn" type="submit" value="Register" />
          </div>
          <div className="errMessage">
            <p className="error">
              {msg
                ? msg.map((x) => {
                    return <li key={x}>{x}</li>;
                  })
                : null}
            </p>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(SecretRegisterForm);

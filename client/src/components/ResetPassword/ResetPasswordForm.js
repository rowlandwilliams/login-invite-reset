import React, { Component } from "react";
import { resetPassword } from "../../requests/resetpassword";
import { withRouter } from "react-router-dom";

class ResetPasswordForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loginRedirect = this.loginRedirect.bind(this);
    this.state = {
      msg: null,
      success: null,
      token: null,
    };
  }

  handleSubmit(event) {
    const token = this.props.token;
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const credentials = {
      password: formData.get("password"),
      password2: formData.get("confirmPassword"),
    };
    resetPassword(credentials, token)
      .then((res) => {
        this.setState({ msg: res.data.message, success: res.data.success });
      })
      .catch((err) => {
        this.setState({ msg: err.response.data.message, loading: false });
      });
  }

  loginRedirect() {
    this.props.history.push("/sign-in");
  }

  render() {
    const { msg, success } = this.state;

    if (success) {
      return (
        <div className="form-container">
          <p className="form-title">
            Password successfully updated. <br />
            Please check your e-mail for confirmation.
          </p>
          <div className="submitButton">
            <input
              className="btn"
              type="submit"
              value="Login"
              onClick={this.loginRedirect}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="form-container">
        <div className="form-title">
          <div className="form-title header">
            Welcome <br /> {this.props.email} <br /> Please reset your password
            below.
          </div>
        </div>
        <form className="form-form" onSubmit={this.handleSubmit}>
          <input
            className="input"
            type="password"
            name="password"
            placeholder="Password"
          />
          <input
            className="input"
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
          />
          <div className="submitButton">
            <input className="btn" type="submit" value="Reset password" />
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

export default withRouter(ResetPasswordForm);

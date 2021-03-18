import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { checkPasswordToken } from "../../requests/resetpassword";
import ResetPasswordForm from "./ResetPasswordForm";
import { Session } from "../../requests/session";

const initialState = { passwordTokenValid: null };

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      loading: true,
    };
  }

  // work out how to display the 401 messages if the password token validation fails
  componentDidMount() {
    this.props.onSignOut();
    Session.delete();
    this.setState({ loading: true });
    const token = this.props.match.params.token;
    checkPasswordToken(token)
      .then((res) => {
        console.log(res);
        if (res.data.tokenValid) {
          this.setState({
            passwordTokenValid: true,
            token: token,
            loading: false,
            email: res.data.userEmail,
          });
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  }

  render() {
    const { passwordTokenValid, loading, token, email } = this.state;
    if (loading) {
      return <div></div>;
    }

    return (
      <React.Fragment>
        {passwordTokenValid ? (
          <ResetPasswordForm token={token} email={email} />
        ) : (
          <Redirect to="/sign-in" />
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(ResetPassword);

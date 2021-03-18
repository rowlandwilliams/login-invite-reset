import React, { Component } from "react";
import { checkRegister } from "../../requests/checkRegisterToken";
import { withRouter } from "react-router-dom";
import SecretRegisterForm from "./SecretRegisterForm";

class SecretRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenValid: null,
      token: null,
      loading: true,
      email: null,
    };
  }

  componentDidMount() {
    this.props.onSignOut();
    const token = this.props.match.params.token;
    checkRegister(token)
      .then((res) => {
        if (res.data.tokenValid) {
          this.setState({
            tokenValid: true,
            token: token,
            loading: false,
            email: res.data.userEmail,
          });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((err) => {
        this.setState({ tokenValid: false, loading: false });
      });
  }

  render() {
    const { tokenValid, loading, token, email } = this.state;

    if (loading) {
      return <div></div>;
    }

    return (
      <React.Fragment>
        {tokenValid ? (
          <SecretRegisterForm token={token} email={email} />
        ) : (
          <div className="form-container">No valid token</div>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(SecretRegister);

// prevents access to sign in page if already signed in

import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

function SignInRoute(props) {
  const { isSignedIn, children, routeProps } = props;

  return (
    <Route
      {...routeProps}
      render={() => {
        if (isSignedIn) {
          return <Redirect to="/" />;
        } else {
          return children;
        }
      }}
    />
  );
}

SignInRoute.propTypes = {
  isSignedIn: PropTypes.bool,
};

SignInRoute.defaultProps = {
  isSignedIn: false,
};

export default SignInRoute;

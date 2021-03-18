// auth root (must be logged in)

import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

function AuthRoute(props) {
  const { isSignedIn, children, routeProps } = props;

  return (
    <Route
      {...routeProps}
      render={() => {
        if (isSignedIn) {
          return children;
        } else {
          return <Redirect to="/sign-in" />;
        }
      }}
    />
  );
}

AuthRoute.propTypes = {
  isSignedIn: PropTypes.bool,
};

AuthRoute.defaultProps = {
  isSignedIn: false,
};

export default AuthRoute;

// custom admin route

import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

function AdminRoute(props) {
  const { isSignedIn, isAdmin, children, routeProps } = props;

  return (
    <Route
      {...routeProps}
      render={() => {
        if (isSignedIn && isAdmin) {
          return children;
        } else {
          return <Redirect to="/" />;
        }
      }}
    />
  );
}

AdminRoute.propTypes = {
  isSignedIn: PropTypes.bool,
  isAdmin: PropTypes.bool,
};

AdminRoute.defaultProps = {
  isSignedIn: false,
  isAdmin: false,
};

export default AdminRoute;

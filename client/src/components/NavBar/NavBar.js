import React from "react";
// better to use the react-router Link than an `a` anchor tag
// when using react-router
import { withRouter } from "react-router-dom";
// classnames is a pkg that helps concatenate strings together
// can apply rules based on object keys and boolean values as well
import classnames from "classnames";
import Menu from "../Menu/Menu";
import { Session } from "../../requests/session";
import "./styles.css";

function NavBar(props) {
  const { isSignedIn, isAdmin, onSignOut, name } = props;

  function signOut() {
    onSignOut();
    Session.delete()
      .then(() => {
        props.history.push("/sign-in");
      })
      .catch(console.error);
  }

  return (
    // when isSignedIn is true, the class "active" will be applied
    // making the class for this element: "navBar active"
    <div
      className={classnames("navbar", {
        active: isSignedIn,
        hidden: !isSignedIn,
      })}
    >
      <div className="title">
        <a href="/"></a>
      </div>
      <div className="navbar-right">
        <div className="navbar-name">{isSignedIn ? name : null}</div>
        <div className={`${isSignedIn ? "burger" : "subTitle"}`}>
          {isSignedIn ? <Menu isAdmin={isAdmin} onSignOut={signOut} /> : null}
        </div>
      </div>
    </div>
  );
}

export default withRouter(NavBar);

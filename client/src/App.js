import "./App.css";
import Axios from "axios";
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { User } from "./requests/auth";
import SignIn from "./components/SignIn/SignIn";
import HomePage from "./components/HomePage/HomePage";
import AuthRoute from "./components/common/AuthRoute";
import AdminRoute from "./components/common/AdminRoute";
import SignInRoute from "./components/common/SignInRoute";
import AdminBoard from "./components/AdminBoard/AdminBoard";
import NavBar from "./components/NavBar/NavBar";
import SecretRegister from "./components/SecretRegister/SecretRegister";
import ResetPassword from "./components/ResetPassword/ResetPassword";

const initialState = { user: null, isAdmin: null };

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      loading: true,
    };
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  componentDidMount() {
    this.signIn();
    if (window.location.origin === process.env.REACT_APP_HEROKU_URL) {
      window.location.replace(process.env.REACT_APP_APP_URL);
    }
// this is like middleware for axios. all of our requests use this
    // see: https://github.com/axios/axios#interceptors
    Axios.interceptors.response.use(
      (r) => r,
      (err) => {
        // if the request came back with a response that was not a 2XX response,
        // then we need to check the response status code.
        // a 401 means that we are no longer authorized (session has expired)
        // so sign the user out
        if (err.response.status === 401) {
          this.signOut();
        }
        throw err;
      }
    );
  }

  signIn() {
    this.setState({ loading: true }); // set to true when fetch user
    User.getCurrentUser()
      .then((res) => {
        if (!!res.data) {
          // if anything comes back
          this.setState({
            user: res.data.email,
            name: res.data.first_name + " " + res.data.last_name,
            isAdmin: res.data.admin, // set admin state here
            loading: false,
          });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  }

  signOut() {
    this.setState(initialState);
  }

  render() {
    const { user, isAdmin, loading, name } = this.state;

    if (loading) {
      return <div></div>;
    }

    return (
      <div className="app">
        <Router>
          <NavBar
            isSignedIn={!!user}
            isAdmin={isAdmin}
            onSignOut={this.signOut}
            name={name}
          />
          <Switch>
            <AuthRoute isSignedIn={!!user} exact path="/">
              <HomePage />
            </AuthRoute>
            <SignInRoute isSignedIn={!!user} exact path="/sign-in">
              <SignIn onSignIn={this.signIn} />
            </SignInRoute>
            <AdminRoute
              isSignedIn={!!user}
              isAdmin={isAdmin}
              exact
              path="/admin"
            >
              <AdminBoard />
            </AdminRoute>
            <Route exact path="/register/:token">
              <SecretRegister onSignOut={this.signOut} />
            </Route>
            <Route exact path="/reset-password/:token">
              <ResetPassword onSignOut={this.signOut} />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;

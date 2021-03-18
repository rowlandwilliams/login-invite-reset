import { Component } from "react";
import { withRouter } from "react-router-dom";

import "./styles.css";

class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    window.addEventListener("resize", () => {
      this.handleWindowResize();
    });
  }

  render() {
    return <div>You are logged in!</div>;
  }
}

export default withRouter(HomePage);

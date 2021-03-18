import React from "react";
import "./styles.css";
import { Component } from "react";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.dropdownRef = React.createRef();
    this.state = {
      open: false,
    };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleButtonClick = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  handleClickOutside = (event) => {
    if (
      this.dropdownRef.current &&
      !this.dropdownRef.current.contains(event.target)
    ) {
      this.setState({
        open: false,
      });
    }
  };

  render() {
    const { open } = this.state;
    return (
      <div className="btnContainer" ref={this.dropdownRef}>
        <button
          type="button"
          // this is the perfect place to apply classnames
          className={`button ${open ? "open" : ""}`}
          onClick={this.handleButtonClick}
        >
          &#9776;
        </button>
        {open && (
          <div className="dropdown">
            <ul className="dropdown-list">
              {/* 
                slightly simpler way of writing what you wrote. 
                just use the && if the else case is to be null/render nothing
              */}
              {this.props.isAdmin && (
                <li className="dropdown-link">
                  <a
                    href="/admin"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Manage users
                  </a>
                </li>
              )}
              <li className="dropdown-link" onClick={this.props.onSignOut}>
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default Menu;

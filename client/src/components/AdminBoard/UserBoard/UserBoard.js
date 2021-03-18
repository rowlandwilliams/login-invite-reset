import { Component } from "react";
import UserRow from "./UserRow/UserRow";
import { getAllUsers } from "../../../requests/getallusers";

// user table in admin board
class UserBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    getAllUsers()
      .then((res) => this.setState({ users: res.data, isLoading: false }))
      .catch((err) => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    const { users, isLoading } = this.state;
    if (isLoading) {
      return <div></div>;
    }
    return (
      <div className="user-table-container">
        {users.map((user) => {
          return <UserRow key={user.id} user={user} />;
        })}
      </div>
    );
  }
}

export default UserBoard;

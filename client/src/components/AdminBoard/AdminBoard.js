import "./styles.css";
import Tabs from "./Tabs";
import UserBoard from "./UserBoard/UserBoard";
import Invite from "./Invite/Invite";

// admin board component
function AdminBoard() {
  return (
    <div className="adminBoardContainer">
      <Tabs>
        <div label="Manage Users">
          <UserBoard />
        </div>
        <div label="Invite Client">
          <Invite />
        </div>
      </Tabs>
    </div>
  );
}

export default AdminBoard;

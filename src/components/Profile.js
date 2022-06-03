// Components
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ListItem from "./ListItem";
// Hooks
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

function Profile() {
  // Get user
  const { user } = useAuthContext();

  // Set up nav
  const navigate = useNavigate();

  // Function to navigate to change username
  function navChangeUsername() {
    navigate("/change_username");
  }

  // Render
  return (
    <div className="d-flex justify-content-center align-items-center cust-min-height">
      <div className="mw-60pc">
        <h1 className="text-primary text-center">{user.username}'s Account</h1>
        <div className="d-flex flex-wrap justify-content-around align-items-start">
          <Container className="notif-box flex-shrink-0 m-3 p-3 bg-secondary bd-pink-fuzz rounded">
            <h3 className="text-center">Notifications</h3>
            <ListItem
              label="Invite"
              action="Join"
              actionTo="/"
              message="RG1 invited you to their poker game, My Game"
            />
            <ListItem
              label="Invite"
              action="RSVP"
              actionTo="/"
              message="RG1 asked you to RSVP for a session of their poker game, My Game, at TIME on DATE"
            />
            <ListItem
              label="System Notice"
              message="RG1 kicked you from their poker game: My Game"
            />
            <ListItem
              label="System Notice"
              message="RG1 deleted their poker game: My Game"
            />
            <Button className="w-100 mt-3 btn-primary border-0">
              Clear Notifications
            </Button>
          </Container>
          <Container className="w-360px flex-shrink-0 m-3 p-3 bg-secondary bd-pink-fuzz rounded">
            <h3 className="text-center">Manage Account</h3>
            <Button onClick={navChangeUsername} className="w-100 my-2">
              Change Username
            </Button>
            <Button className="w-100 my-2">Change Password</Button>
            <Button className="w-100 my-2">Change Email</Button>
            <Button className="w-100 my-2 btn-warning border-0">
              Delete Account
            </Button>
          </Container>
        </div>
      </div>
    </div>
  );
}

export default Profile;

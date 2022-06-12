// Components
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Alert from "./Alert";
import ListItem from "./ListItem";
// Hooks
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

function Profile() {
  // State
  const [notifications, setNotifications] = useState([]);
  const [errors, setErrors] = useState([]);

  // Location state
  const { state } = useLocation();

  // Context
  const { user } = useAuthContext();

  // Constants
  const navigate = useNavigate();
  const locale =
    navigator.languages.length === 0 ? "en-US" : navigator.languages[0];

  // Effects
  useEffect(() => {
    // Fetch notifications for this user
    async function fetchNotifications() {
      const result = await fetch("http://localhost:3001/api/notifications", {
        method: "GET",
        credentials: "include",
      });

      const res = await result.json();

      if (res.status === "error") {
        setErrors(res.errors);
      } else {
        setNotifications(res.notifications);
      }
    }

    fetchNotifications();
  }, []);

  // Functions
  async function clearNotifications() {
    const result = await fetch(
      "http://localhost:3001/api/clear_notifications",
      {
        method: "POST",
        credentials: "include",
      }
    );

    const res = await result.json();

    if (res.status === "error") {
      setErrors(res.errors);
    } else {
      setNotifications([]);
    }
  }

  function navChangeUsername() {
    navigate("/change_username");
  }

  function navChangePassword() {
    navigate("/change_password");
  }

  function navChangeEmail() {
    navigate("/change_email");
  }

  function navDeleteAccount() {
    navigate("/delete_account");
  }

  // Optional JSX for render
  const alertList = state
    ? state.alerts.map((alert) => (
        <Alert key={alert.key} warning={false} message={alert.message} />
      ))
    : "";

  const errorList = errors.map((error) => (
    <Alert key={error.param} warning={true} message={error.msg} />
  ));

  const NotificationList = notifications.map((notif) => {
    var action;
    var apiEndpoint;
    // Check if notification has an action associated with it
    if (notif.label === "Game Invite") {
      action = "Join";
      apiEndpoint = "join_game";
    } else if (notif.label === "Session Invite") {
      action = "RSVP";
      apiEndpoint = "rsvp_game";
    }
    // Generate function to call when notification's action is clicked
    if (apiEndpoint === "join_game" || apiEndpoint === "rsvp_game") {
      var apiFunction = async function () {
        const response = await fetch(
          `http://localhost:3001/api/${apiEndpoint}`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              gameId: notif.game,
            }),
          }
        );

        const res = await response.json();

        // Resulting behavior is based on which endpoint was used
        if (res.status === "error") {
          setErrors(res.errors);
          return;
        } else if (notif.label === "Game Invite") {
          navigate(`/games/${notif.game}`, {
            state: {
              alerts: [
                {
                  message: `Welcome to the game, ${user.username}`,
                  key: "gameInviteWelcome",
                },
              ],
            },
          });
        } else {
          navigate("/profile", {
            state: {
              alerts: [
                {
                  message: `Successfully RSVPed for ${res.game}`,
                  key: "gameInviteWelcome",
                },
              ],
            },
          });
        }
      };
    }

    return (
      <ListItem
        key={notif.date}
        label={notif.label}
        message={notif.message}
        action={action}
        apiCallback={apiFunction}
      />
    );
  });

  // Render
  return (
    <>
      {alertList}
      {errorList}
      <h1 className="text-primary text-center mt-4">
        {user.username}'s Account
      </h1>
      <div className="d-flex flex-wrap justify-content-around align-items-start">
        <Container className="notif-box flex-shrink-0 m-3 p-3 bg-secondary bd-pink-fuzz rounded">
          <h3 className="text-center mb-3">Notifications</h3>
          {NotificationList}
          <ListItem
            label="Invite"
            action="RSVP"
            actionTo="/"
            message="RG1 asked you to RSVP for a session of their poker game, My Game, at TIME on DATE"
          />
          <Button
            onClick={clearNotifications}
            className="w-100 mt-2 btn-primary border-0"
          >
            Clear Notifications
          </Button>
        </Container>
        <Container className="w-360px flex-shrink-0 m-3 p-3 bg-secondary bd-pink-fuzz rounded">
          <h3 className="text-center mb-3">Manage Account</h3>
          <Button onClick={navChangeUsername} className="w-100 mb-2">
            Change Username
          </Button>
          <Button onClick={navChangePassword} className="w-100 mb-2">
            Change Password
          </Button>
          <Button onClick={navChangeEmail} className="w-100 mb-2">
            Change Email
          </Button>
          <Button
            onClick={navDeleteAccount}
            className="w-100 btn-warning border-0"
          >
            Delete Account
          </Button>
        </Container>
      </div>
    </>
  );
}

export default Profile;

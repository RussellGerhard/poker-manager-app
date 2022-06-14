// Imports
import he from "he";
// Components
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ListItem from "./ListItem";
// Hooks
import { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useErrorContext } from "../contexts/ErrorContext";
import { useAlertContext } from "../contexts/AlertContext";

function Profile() {
  // Location state
  const { state } = useLocation();

  // State
  const [notifications, setNotifications] = useState([]);

  // Context
  const { user } = useAuthContext();
  const { setErrors } = useErrorContext();
  const { setAlert } = useAlertContext();

  // Constants
  const navigate = useNavigate();
  const locale =
    navigator.languages.length === 0 ? "en-US" : navigator.languages[0];

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
    navigate("/delete_account", {
      state: {
        gameId: null,
        userId: null,
        endpoint: "delete_account",
        nav_dest: "/",
      },
    });
  }

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

  useLayoutEffect(() => {
    if (state && state.alert) setAlert(state.alert);
    setErrors([]);
    return () => {
      setAlert(null);
    };
  }, []);

  // Optional JSX for render
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
              alert: `Welcome to the game, ${user.username}`,
            },
          });
        } else {
          navigate("/profile", {
            state: {
              alerts: `Successfully RSVPed for ${res.game}`,
            },
          });
        }
      };
    }

    const date = Date.parse(notif.date);
    const formatted_date = new Intl.DateTimeFormat(locale, {
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
    }).format(date);

    return (
      <ListItem
        key={notif.date}
        label={notif.label}
        text={formatted_date}
        textColor="black"
        smallText={true}
        message={he.decode(notif.message)}
        action={action}
        apiCallback={apiFunction}
      />
    );
  });

  // Render
  return (
    <>
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
          <Button onClick={navChangeEmail} className="w-100 mb-2">
            Change Email
          </Button>
          <Button onClick={navChangeUsername} className="w-100 mb-2">
            Change Username
          </Button>
          <Button onClick={navChangePassword} className="w-100 mb-2">
            Change Password
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

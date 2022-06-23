// Imports
import he from "he";
// Components
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/esm/CloseButton";
import ListItem from "./ListItem";
import Loading from "./Loading";
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
  const [loading, setLoading] = useState([]);
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
  async function closeNotification(notifId) {
    const response = await fetch(
      "http://localhost:3001/api/delete_notification",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId: notifId,
        }),
      }
    );

    const res = await response.json();

    if (res.status === "error") {
      setErrors(res.errors);
    } else {
      setNotifications(notifications.filter((notif) => notif._id !== notifId));
    }
  }

  async function clearNotifications() {
    const response = await fetch(
      "http://localhost:3001/api/clear_notifications",
      {
        method: "POST",
        credentials: "include",
      }
    );

    const res = await response.json();

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

  async function fetchNotifications() {
    const response = await fetch("http://localhost:3001/api/notifications", {
      method: "GET",
      credentials: "include",
    });

    const res = await response.json();

    if (res.status === "error") {
      setErrors(res.errors);
    } else {
      setNotifications(res.notifications);
    }
    setLoading(false);
  }

  // Effects
  useEffect(() => {
    // Fetch notifications for this user
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
  const notificationList = notifications.map((notif) => {
    var action;
    var apiEndpoint;
    var secondAction;
    var secondApiEndpoint;
    // Check if notification has an action associated with it
    if (notif.label === "Game Invite") {
      action = "Join";
      apiEndpoint = "join_game";
    } else if (notif.label === "Session Invite") {
      action = "Accept";
      apiEndpoint = "member_accept_rsvp";
      secondAction = "Decline";
      secondApiEndpoint = "member_decline_rsvp";
    }
    // Generate function to call when notification's action is clicked
    if (apiEndpoint === "join_game" || apiEndpoint === "member_accept_rsvp") {
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
          setAlert("Successfully joined game");
          fetchNotifications();
        } else {
          setAlert(`Successfully RSVPed for ${res.game}`);
          fetchNotifications();
        }
      };
    }
    if (secondApiEndpoint === "member_decline_rsvp") {
      var secondApiFunction = async function () {
        const response = await fetch(
          `http://localhost:3001/api/${secondApiEndpoint}`,
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

        if (res.status === "error") {
          setErrors(res.errors);
        } else {
          setAlert(`You declined to RSVP for ${res.game}`);
          fetchNotifications();
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
      <div key={notif.date} className="d-flex flex-row justify-context-start">
        <ListItem
          label={notif.label}
          text={formatted_date}
          textColor="black"
          smallText={true}
          message={he.decode(notif.message)}
          action={action}
          apiCallback={apiFunction}
          secondAction={secondAction}
          secondApiCallback={secondApiFunction}
        />
        <div
          className="my-2 align-self-stretch border border-3 border-start-0 border-primary"
          style={{ backgroundColor: "#2de2e6", width: "27px" }}
        >
          <CloseButton
            onClick={() => {
              closeNotification(notif._id);
            }}
          />
        </div>
      </div>
    );
  });

  // Render
  return loading ? (
    <Loading />
  ) : (
    <>
      <h1 className="text-primary text-center mt-4">
        {user.username}'s Account
      </h1>
      <div className="d-flex flex-wrap justify-content-around align-items-start">
        <Container className="w-360px m-3 p-3 bg-secondary bd-pink-fuzz rounded">
          <h3 className="text-center mb-2">Notifications</h3>
          {notificationList.length === 0 ? (
            <ListItem label="No notifications yet!" />
          ) : (
            notificationList
          )}
          <Button
            onClick={clearNotifications}
            className="w-100 mt-2 btn-primary border-0"
          >
            Clear Notifications
          </Button>
        </Container>
        <Container className="w-360px m-3 p-3 bg-secondary bd-pink-fuzz rounded">
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

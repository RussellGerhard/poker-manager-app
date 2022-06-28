// Components
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Logo from "./Logo";
// Hooks
import { useLocation } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import { useErrorContext } from "../contexts/ErrorContext";
import { useAlertContext } from "../contexts/AlertContext";
// Constants
const { REACT_APP_API_ROOT } = process.env;

function Home() {
  // Location state
  var { state } = useLocation();

  // State
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [disableContactSubmit, setDisableContactSubmit] = useState(false);

  // Context
  const { setErrors } = useErrorContext();
  const { setAlert } = useAlertContext();

  // Functions
  const submitContactForm = async (e) => {
    e.preventDefault();
    setDisableContactSubmit(true);

    const response = await fetch(`${REACT_APP_API_ROOT}/submit_contact_form`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        message: message,
      }),
    });

    const res = await response.json();

    setDisableContactSubmit(false);
    if (res.status === "error") {
      setErrors(res.errors);
    } else {
      setAlert("Message sent!");
      setName("");
      setMessage("");
    }
  };

  // Effects
  useLayoutEffect(() => {
    if (state) setAlert(state.alert);
    setErrors([]);
    return () => {
      setAlert(null);
    };
  }, []);

  return (
    <div className="home-page-container mx-auto my-3">
      <div
        className="d-flex flex-column align-items-center"
        style={{ maxWidth: "784px" }}
      >
        <div>
          <Container
            className="mx-auto my-3 p-3 bg-pink bd-pink-fuzz rounded txt-lg text-center"
            style={{ width: "360px" }}
          >
            <div className="m-3">
              <Logo width="200" />
            </div>
            <h1>Home Game</h1>
            <h3 className="mb-3">Your weekly poker session made easy</h3>
          </Container>
        </div>
        <div className="d-flex flex-row flex-wrap justify-content-around">
          <Container
            className="mx-auto my-3 p-3 bg-pink bd-pink-fuzz rounded txt-lg "
            style={{ width: "360px" }}
          >
            <h4 className="text-center mb-3">Game Admin Console</h4>
            <ul className="txt-md m-0 ">
              <li>Add Home Game users to your game</li>
              <li>Edit game information like stakes and max buy-in</li>
              <li>Invite game members to RSVP for poker sessions</li>
              <li>Determine who's coming at a glance</li>
              <li>Stay in touch by posting on your game's message board</li>
            </ul>
          </Container>
          <Container
            className="mx-auto my-3 p-3 bg-pink bd-pink-fuzz rounded txt-lg"
            style={{ width: "360px" }}
          >
            <h4 className="text-center mb-3">Venmo-Enabled Cashout</h4>
            <ul className="txt-md m-0">
              <li>Use the session cashier to log cashouts</li>
              <li>
                Easily add members who forgot to RSVP or remove members who
                didn't show
              </li>
              <li>
                Optionally send members a Home Game notification with a custom
                Venmo link for their cashout request
              </li>
              <li>Auto-update the game's leaderboard after cashout</li>
            </ul>
          </Container>
          <div className="home-page-collapse mx-auto my-3 p-3 bg-pink bd-pink-fuzz rounded txt-lg text-center ">
            Home Game is completely free; however, if you'd like to make a
            donation to the developer, please venmo @RussellGerhard
          </div>
          <div className="home-page-collapse mx-auto my-3 p-3 bg-pink bd-pink-fuzz rounded txt-lg text-center ">
            <h4 className="mb-3">Contact</h4>
            <p className="txt-md">
              If you discover a bug, want a new feature, or just want to get in
              touch, send me an email!
            </p>
            <Form
              onSubmit={(e) => {
                submitContactForm(e);
              }}
            >
              <Form.Control
                onChange={(e) => {
                  setName(e.target.value);
                }}
                className="mb-2"
                type="name"
                placeholder="Name"
                value={name}
              />
              <Form.Control
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                value={message}
                className="mb-3"
                as="textarea"
                rows={2}
                placeholder="Message"
              ></Form.Control>
              <Button
                className="w-100"
                variant="primary"
                type="submit"
                disabled={disableContactSubmit}
              >
                Submit
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

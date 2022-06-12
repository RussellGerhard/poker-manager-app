// Components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Alert from "./Alert";
// Hooks
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function FinalWarning(props) {
  // State
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [errors, setErrors] = useState([]);

  // Location state
  const { state } = useLocation();

  // Constants
  const navigate = useNavigate();

  // Functions
  async function deleteItem(e, gameId, userId, endpoint) {
    e.preventDefault();
    setDisableSubmit(true);

    const response = await fetch(`http://localhost:3001/api/${endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId: gameId,
        userId: userId,
      }),
    });

    const res = await response.json();

    // TODO logic to redirect based on what final warning was for
    if (res.status === "error") {
      setErrors(res.errors);
    } else {
      navigate(state.nav_dest);
    }

    setDisableSubmit(false);
  }

  // Optional JSX for render
  const errorList = errors.map((error) => (
    <Alert key={error.param} warning={true} message={error.msg} />
  ));

  return (
    <div className="w-360px">
      {errorList}
      <Container className="my-3 p-3 bg-secondary bd-pink-fuzz rounded">
        <h3 className="text-center mb-3">{props.title}</h3>
        <p className="text-center">{props.message}</p>
        <p className="text-center font-weight-bold">
          <strong>{props.bold}</strong>
        </p>
        <Form
          onSubmit={(e) =>
            deleteItem(e, state.gameId, state.userId, state.endpoint)
          }
          className="mt-2"
        >
          <Button
            className="w-100 "
            variant="danger"
            type="submit"
            disabled={disableSubmit}
          >
            {props.action}
          </Button>
        </Form>
      </Container>
    </div>
  );
}

export default FinalWarning;

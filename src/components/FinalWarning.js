// Components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
// Hooks
import { useState, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useErrorContext } from "../contexts/ErrorContext";

function FinalWarning(props) {
  // State
  const [disableSubmit, setDisableSubmit] = useState(false);

  // Location state
  const { state } = useLocation();

  // Context
  const { setUser } = useAuthContext();
  const { setErrors } = useErrorContext();

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

    if (res.status === "error") {
      setErrors(res.errors);
    } else {
      if (endpoint === "delete_account") {
        setUser(null);
      }
      navigate(state.nav_dest);
    }

    setDisableSubmit(false);
  }

  // Effects
  useLayoutEffect(() => {
    setErrors([]);
  }, []);

  return (
    <div className="w-360px">
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

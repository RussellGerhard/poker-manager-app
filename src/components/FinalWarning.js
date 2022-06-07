// Components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
// Hooks
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

function FinalWarning(props) {
  // State
  const [disableSubmit, setDisableSubmit] = useState(false);

  // Location state
  const { state } = useLocation();

  // Context
  const { user } = useAuthContext();

  // Constants
  const navigate = useNavigate();

  // Functions
  async function deleteItem(e, id, endpoint) {
    e.preventDefault();
    setDisableSubmit(true);

    const response = await fetch(`http://localhost:3001/api/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user._id,
        genId: id,
      }),
    });

    const res = await response.json();

    // TODO logic to redirect based on what final warning was for
    if (res.status === "ok") {
      navigate("/games");
    }

    setDisableSubmit(false);
  }

  return (
    <div className="d-flex justify-content-center align-items-center cust-min-height">
      <div className="mw-306px">
        <Container className="my-3 p-3 bg-secondary bd-pink-fuzz rounded">
          <h3 className="text-center mb-3">{props.title}</h3>
          <p className="text-center">{props.message}</p>
          <p className="text-center font-weight-bold">
            <strong>{props.bold}</strong>
          </p>
          <Form
            onSubmit={(e) => deleteItem(e, state.id, state.endpoint)}
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
    </div>
  );
}

export default FinalWarning;

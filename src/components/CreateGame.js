// Components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";
import Error from "./Error";
// Hooks
import { useAuthContext } from "../contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateGame() {
  // AuthContext
  const { loading, user } = useAuthContext();

  // State for form disable and errors
  const [disableCreateGame, setDisableCreateGame] = useState(false);
  const [errors, setErrors] = useState([]);

  // Set up navigation
  const navigate = useNavigate();

  // Wait for context provider
  if (loading) {
    return <Loading />;
  }

  // Check for auth
  if (!user) {
    return (
      <Navigate to="/login" state={{ alertNoAuth: true }} replace={true} />
    );
  }

  // Form errors to display
  const errorList = errors.map((error) => (
    <Error key={error.param} message={error.msg} />
  ));

  // Function to create new game
  async function createNewGame(e) {
    e.preventDefault();

    // Disable create button
    setDisableCreateGame(true);

    // Grab name input
    const name = e.target[0].value;
    const userId = user._id;

    // Send info to backend and await response
    const response = await fetch("http://localhost:3001/api/create_game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        userId,
      }),
    });

    const res = await response.json();

    // Re-enable button
    setDisableCreateGame(false);

    // Set errors if necessary
    if (res.status === "error") {
      setErrors(res.errors);
      return;
    } else {
      navigate("/games", { state: { alertCreateGameSuccess: true } });
      return;
    }
  }

  // Render
  return (
    <div className="d-flex justify-content-center align-items-center cust-min-height">
      <div className="mw-360px">
        {errorList}
        <Container className="my-3 p-3 w-360px bg-secondary bd-pink-fuzz rounded">
          <h3 className="text-center">Create Game</h3>
          <Form onSubmit={createNewGame} className="mt-4">
            <Form.Group className="mb-3" controlId="name">
              <Form.Control type="text" placeholder="Name" />
            </Form.Group>
            <Button
              className="w-100 my-3"
              variant="primary"
              type="submit"
              disabled={disableCreateGame}
            >
              Create
            </Button>
          </Form>
        </Container>
      </div>
    </div>
  );
}

export default CreateGame;

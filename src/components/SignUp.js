// Bootstrap components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
// Dev components
import Logo from "./Logo";
import Error from "./Error";
import React from "react";
// Hooks
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp(props) {
  // State to keep track of errors
  const [errors, setErrors] = useState([]);
  const [disableSignUp, setDisableSignUp] = useState(false);

  // Set up navigation
  const navigate = useNavigate();

  // Error list
  const errorList = errors.map((error) => (
    <Error key={error.param} message={error.msg} />
  ));

  // Function to handle submit
  async function registerUser(e) {
    // Prevent page refresh
    e.preventDefault();

    // Disable signup button while request is made
    setDisableSignUp(true);

    // Grab form input
    const username = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const password_conf = e.target[3].value;

    // Send info to backend and await response
    const response = await fetch("http://localhost:3001/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        password_conf,
      }),
    });

    // Wait for response from backend (JSON data)
    const res = await response.json();

    // Set errors to be displayed
    if (res.status === "error") {
      setErrors(res.errors);
    } else {
      navigate("/login", {
        state: { username: username, alertRegistration: true },
      });
    }

    setDisableSignUp(false);
  }

  // Render component
  return (
    <div className="d-flex justify-content-center align-items-center cust-min-height">
      <div className="mw-306px">
        {errorList}
        <Container className="my-3 p-3 bg-pink bd-pink-fuzz rounded">
          <Logo width="150" />
          <Form onSubmit={registerUser} className="mt-4">
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Username" />
              <div className="txt-xs m-1">
                Use letters, numbers, and underscores
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="email" placeholder="Email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password-confirm">
              <Form.Label>Comfirm Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
              <div className="txt-xs m-1">
                Use 8 to 20 characters with a mix of letters, numbers, and
                symbols
              </div>
            </Form.Group>

            <Button
              className="w-100 my-3"
              variant="primary"
              type="submit"
              disabled={disableSignUp}
            >
              Sign Up
            </Button>
          </Form>
        </Container>
      </div>
    </div>
  );
}

export default SignUp;

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Logo from "./Logo";

// Hooks
import { useLocation } from "react-router-dom";

function LogIn() {
  var { state } = useLocation();
  console.log("logging state:", state);

  // Display message if user was redirected from sign up
  if (state && state.alertRegistration && state.username) {
    var registrationMessage = (
      <div className="my-3 p-3 bg-primary bd-primary-fuzz rounded text-center">
        Thanks for signing up, {state.username}!
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center cust-min-height">
      <div className="mw-306px">
        {registrationMessage}
        <Container className="my-3 p-3 mw-360px bg-pink bd-pink-fuzz rounded">
          <Logo width="150" />
          <Form className="mt-4">
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="email" placeholder="Email" />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            <div className="mb-1">
              <a className="txt-sm" href="TODO">
                Forgot Your Password?
              </a>
            </div>

            <Button className="w-100 my-3" variant="primary" type="submit">
              Log In
            </Button>
          </Form>
        </Container>
      </div>
    </div>
  );
}

export default LogIn;

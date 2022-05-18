import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function LoginForm() {
  return (
    <Form className="mt-4">
      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
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
  );
}

export default LoginForm;

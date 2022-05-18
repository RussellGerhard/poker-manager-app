import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function RegisterForm() {
  return (
    <Form className="mt-4">
      <Form.Group className="mb-3" controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" placeholder="Enter email" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="password-confirm">
        <Form.Label>Comfirm Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>

      <Button className="w-100 my-3" variant="primary" type="submit">
        Register
      </Button>
    </Form>
  );
}

export default RegisterForm;

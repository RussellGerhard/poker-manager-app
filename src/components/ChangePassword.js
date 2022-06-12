// Components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
// Hooks

function ChangePassword() {
  return (
    <Container className="my-3 p-3 bg-secondary bd-pink-fuzz rounded">
      <h3 className="text-center mb-3">Change Password</h3>
      <Form onSubmit={() => {}}>
        <Form.Group className="mb-3" controlId="new-password">
          <Form.Label>New Password</Form.Label>
          <Form.Control type="password" />
          <div className="txt-xs mt-1">
            Use 8 to 20 characters with a mix of letters, numbers, and symbols
          </div>
        </Form.Group>

        <Form.Group className="mb-3" controlId="new-password-confirm">
          <Form.Label>Comfirm New Password</Form.Label>
          <Form.Control type="password" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Old Password</Form.Label>
          <Form.Control type="password" />
        </Form.Group>

        <Button
          className="w-100"
          variant="primary"
          type="submit"
          disabled={false}
        >
          Change Password
        </Button>
      </Form>
    </Container>
  );
}

export default ChangePassword;

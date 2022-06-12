// Components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
// Hooks

function ChangeEmail() {
  return (
    <Container className="my-3 p-3 bg-secondary bd-pink-fuzz rounded">
      <h3 className="text-center mb-3">Change Email</h3>
      <Form onSubmit={() => {}}>
        <Form.Group className="mb-3" controlId="new-email">
          <Form.Label>New Email</Form.Label>
          <Form.Control type="email" placeholder="pokerfan@gmail.com" />
        </Form.Group>

        <Button
          className="w-100"
          variant="primary"
          type="submit"
          disabled={false}
        >
          Change Email
        </Button>
      </Form>
    </Container>
  );
}

export default ChangeEmail;

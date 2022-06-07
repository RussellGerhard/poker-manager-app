// Components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
// Hooks

function ChangeUsername() {
  return (
    <div className="d-flex justify-content-center align-items-center cust-min-height">
      <div className="mw-306px">
        <Container className="my-3 p-3 bg-secondary bd-pink-fuzz rounded">
          <h3 className="text-center mb-3">Change Username</h3>
          <Form onSubmit={() => {}}>
            <Form.Group className="mb-3" controlId="new-username">
              <Form.Label>New Username</Form.Label>
              <Form.Control type="text" placeholder="Poker_Fan123" />
              <div className="txt-xs m-1">
                Use letters, numbers, and underscores
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="new-username-confirm">
              <Form.Label>Comfirm Username</Form.Label>
              <Form.Control type="text" placeholder="Poker_Fan123" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            <Button
              className="w-100 "
              variant="primary"
              type="submit"
              disabled={false}
            >
              Change Username
            </Button>
          </Form>
        </Container>
      </div>
    </div>
  );
}

export default ChangeUsername;

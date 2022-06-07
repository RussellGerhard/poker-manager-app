import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

function AddMember() {
  return (
    <div className="d-flex justify-content-center align-items-center cust-min-height">
      <div>
        <Container className="my-3 p-3 bg-secondary bd-pink-fuzz rounded">
          <h3 className="text-center mb-3">Add Member</h3>
          <Form onSubmit={() => {}}>
            <Form.Group className="mb-3" controlId="new-username">
              <Form.Label>Member Username</Form.Label>
              <Form.Control type="text" placeholder="Poker_Fan123" />
            </Form.Group>

            <Button
              className="w-100"
              variant="primary"
              type="submit"
              disabled={false}
            >
              Send Invite
            </Button>
          </Form>
        </Container>
      </div>
    </div>
  );
}

export default AddMember;

// Components
import Container from "react-bootstrap/Container";

function Error(props) {
  return (
    <Container className="my-3 p-3 bg-warning bd-warning-fuzz rounded">
      {props.message}
    </Container>
  );
}

export default Error;

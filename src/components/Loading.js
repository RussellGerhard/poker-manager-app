import Spinner from "react-bootstrap/Spinner";

function Loading() {
  return (
    <div className="d-flex p-5 align-items-center justify-content-center position-relative">
      <Spinner
        className="position-fixed"
        animation="grow"
        variant="secondary"
      />
    </div>
  );
}

export default Loading;

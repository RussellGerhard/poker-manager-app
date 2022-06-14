// Components
import CloseButton from "react-bootstrap/CloseButton";
// Hooks
import { useRef } from "react";

function Alert(props) {
  const alert = useRef(null);

  return (
    <div className="position-relative my-4" ref={alert}>
      <div
        className={`${
          props.warning
            ? "bg-warning bd-warning-fuzz"
            : "bg-primary bd-primary-fuzz"
        } p-3 rounded text-center`}
      >
        {props.message}
      </div>
      <CloseButton
        onClick={props.onClose}
        className="position-absolute top-0 end-0"
      />
    </div>
  );
}

export default Alert;

// Imports
import he from "he";
// Components
import Alert from "./Alert";
// Hooks
import { useRef, useEffect } from "react";
import { useErrorContext } from "../contexts/ErrorContext";
import { useAlertContext } from "../contexts/AlertContext";
import { useAuthContext } from "../contexts/AuthContext";

function AlertErrorWrapper({ children }) {
  // Refs
  const errorListStart = useRef(null);

  // Context
  const { errors, setErrors } = useErrorContext();
  const { alert, setAlert } = useAlertContext();
  const { loading } = useAuthContext();

  // Check for user session error first (so that private routes will catch on sess expiration)
  if (errors[0]?.param === "NoUserSession" && !loading) {
    console.log("this is the problem");
    //window.location.reload();
  }

  // Functions
  function handleErrorRemove(key) {
    const newErrors = errors.filter((error) => error.param !== key);

    setErrors(newErrors);
  }

  // Effects
  useEffect(() => {
    if (errorList.length != 0 || alert) {
      errorListStart.current.scrollIntoView({
        block: "start",
        inline: "nearest",
        behavior: "smooth",
      });
    }
  }, [errors, alert]);

  // Optional JSX for render
  const errorList = errors.map((error) => (
    <Alert
      key={error.param}
      warning={true}
      message={error.msg}
      onClose={() => handleErrorRemove(error.param)}
    />
  ));

  return (
    <div className="d-flex justify-content-center align-items-center cust-min-height">
      <div>
        <div ref={errorListStart}>{errorList}</div>
        {alert && (
          <Alert
            message={he.decode(alert)}
            onClose={() => {
              setAlert(null);
            }}
          />
        )}
        {children}
      </div>
    </div>
  );
}

export default AlertErrorWrapper;

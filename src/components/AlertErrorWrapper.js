// Components
import Alert from "./Alert";
// Hooks
import { useErrorContext } from "../contexts/ErrorContext";
import { useAlertContext } from "../contexts/AlertContext";

function AlertErrorWrapper({ children }) {
  // Context
  const { errors, setErrors } = useErrorContext();
  const { alert, setAlert } = useAlertContext();

  // Functions
  function handleErrorRemove(key) {
    const newErrors = errors.filter((error) => error.param !== key);

    setErrors(newErrors);
  }

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
        {alert && (
          <Alert
            message={alert}
            onClose={() => {
              setAlert(null);
            }}
          />
        )}
        {errorList}
        {children}
      </div>
    </div>
  );
}

export default AlertErrorWrapper;

// Components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
// Hooks
import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useErrorContext } from "../contexts/ErrorContext";
// Constants
const { REACT_APP_API_ROOT } = process.env;

function ChangePassword() {
  // Refs
  const newPasswordInput = useRef();

  // State
  const [disableSubmit, setDisableSubmit] = useState(false);

  // Constants
  const navigate = useNavigate();
  const params = useParams();

  // Contexts
  const { setErrors } = useErrorContext();

  // Functions
  async function changePassword(e) {
    e.preventDefault();
    setDisableSubmit(true);

    const new_password = e.target[0].value;
    const new_password_conf = e.target[1].value;

    if (new_password !== new_password_conf) {
      setErrors([
        {
          value: new_password_conf,
          msg: "Password does does not match confirmation",
          param: "new_password_conf",
          location: "body",
        },
      ]);
      setDisableSubmit(false);
      return;
    }

    const response = await fetch(`${REACT_APP_API_ROOT}/change_password`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: new_password,
        token: params?.token,
      }),
    });

    const res = await response.json();

    if (res.status === "error") {
      setErrors(res.errors);
      setDisableSubmit(false);
    } else {
      if (params?.token) {
        navigate("/login", {
          state: {
            alert: "Password updated successfully",
          },
        });
      } else {
        navigate("/", {
          state: {
            alert: "Password updated successfully",
          },
        });
      }
    }
  }

  // Effects
  useEffect(() => {
    newPasswordInput.current.focus();
  }, []);

  useLayoutEffect(() => {
    setErrors([]);
  }, []);

  return (
    <Container className="my-3 p-3 bg-secondary bd-pink-fuzz rounded">
      <h3 className="text-center mb-3">Change Password</h3>
      <Form onSubmit={changePassword}>
        <Form.Group className="mb-3" controlId="new-password">
          <Form.Label>New Password</Form.Label>
          <Form.Control ref={newPasswordInput} type="password" />
          <div className="txt-xs m-1">
            Use 8 to 20 characters with a mix of letters, numbers, and symbols
          </div>
        </Form.Group>

        <Form.Group className="" controlId="new-password-confirm">
          <Form.Label>Comfirm New Password</Form.Label>
          <Form.Control type="password" />
        </Form.Group>

        <Button
          className="w-100 mt-3"
          variant="primary"
          type="submit"
          disabled={disableSubmit}
        >
          Change Password
        </Button>
      </Form>
    </Container>
  );
}

export default ChangePassword;

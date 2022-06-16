// Components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
// Hooks
import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useErrorContext } from "../contexts/ErrorContext";

function ChangePassword() {
  // Refs
  const newPasswordInput = useRef();

  // State
  const [disableSubmit, setDisableSubmit] = useState(false);

  // Constants
  const navigate = useNavigate();

  // Contexts
  const { setErrors } = useErrorContext();

  // Functions
  async function changePassword(e) {
    e.preventDefault();
    setDisableSubmit(true);

    const new_password = e.target[0].value;
    const new_password_conf = e.target[1].value;
    const password = e.target[2].value;

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

    const psw_check_response = await fetch(
      "http://localhost:3001/api/password_check",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password,
        }),
      }
    );

    const psw_check_res = await psw_check_response.json();

    if (!psw_check_res.isMatch) {
      setErrors([
        {
          value: "",
          msg: "Password is not correct",
          param: "password_incorrect",
          location: "body",
        },
      ]);
      setDisableSubmit(false);
      return;
    }

    const response = await fetch("http://localhost:3001/api/change_password", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: new_password,
      }),
    });

    const res = await response.json();

    if (res.status === "error") {
      setErrors(res.errors);
      setDisableSubmit(false);
    } else {
      navigate("/profile", {
        state: {
          alert: "Password updated successfully",
        },
      });
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

        <Form.Group className="mb-3" controlId="new-password-confirm">
          <Form.Label>Comfirm New Password</Form.Label>
          <Form.Control type="password" />
        </Form.Group>

        <Form.Group className="" controlId="password">
          <Form.Label>Old Password</Form.Label>
          <Form.Control type="password" />
        </Form.Group>
        <Link className="m-1 mt-0 txt-sm" to="/forgot_password">
          Forgot Password?
        </Link>

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

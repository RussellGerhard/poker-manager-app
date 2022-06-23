// Components
import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import Logo from "./Logo";
// Hooks
import { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useErrorContext } from "../contexts/ErrorContext";

function NavigationMenu() {
  // In accordance with react-boostrap md breakpoint
  // const IS_MOBILE = useMediaQuery({ query: "(max-width: 768)" });

  // Context
  const { user, setUser } = useAuthContext();
  const { setErrors } = useErrorContext();

  // Constants
  const navigate = useNavigate();

  // Functions
  async function logUserOut(e) {
    // Make api call to logout
    const response = await fetch("http://localhost:3001/api/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();

    if (res.status === "error") {
      setErrors(res.errors);
    } else {
      // Remove user and redirect to home
      setUser(null);
      navigate("/");
    }
  }

  // Effects
  useLayoutEffect(() => {
    setErrors([]);
  }, []);

  // Render
  return (
    <Nav className="bg-pink bd-pink-fuzz align-items-center">
      <Nav.Item>
        <Nav.Link as={Link} to="/">
          <div className="d-flex">
            <div className="mx-1">
              <Logo width="25" />
            </div>
            <div className="txt-wght-500 align-self-center">
              <span className="text-dark">Home Game</span>
            </div>
          </div>
        </Nav.Link>
      </Nav.Item>
      <>
        {user && (
          <Dropdown>
            <Dropdown.Toggle className="bg-secondary border-0">
              {user.username}
            </Dropdown.Toggle>
            <Dropdown.Menu className="bg-secondary bd-pink-fuzz">
              <Dropdown.Item as={Link} to="profile" className="hover-primary">
                Profile
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="games" className="hover-primary">
                Games
              </Dropdown.Item>
              <hr></hr>
              <Dropdown.Item className="hover-primary" onClick={logUserOut}>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
        {!user && (
          <>
            <Nav.Item>
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/signup">
                Sign Up
              </Nav.Link>
            </Nav.Item>
          </>
        )}
      </>
    </Nav>
  );
}

export default NavigationMenu;

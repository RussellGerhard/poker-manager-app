// Imports
// import { useMediaQuery } from "react-responsive";
// Components
import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/Dropdown";
import Logo from "./Logo";
// Hooks
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

function NavigationMenu() {
  // In accordance with react-boostrap md breakpoint
  // const IS_MOBILE = useMediaQuery({ query: "(max-width: 768)" });

  // Set up navigation hook
  const navigate = useNavigate();

  // Get user context
  const { user, setUser } = useAuthContext();

  // Handle user logout
  async function logUserOut(e) {
    // Remove user, clear local storage, and redirect to home
    setUser(null);
    localStorage.clear();
    navigate("/");
  }

  // Display nav depending on AuthContext
  return (
    <Nav className="bg-pink bd-pink-fuzz align-items-center">
      <Nav.Item>
        <Nav.Link href="/">
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
              <Dropdown.Item className="hover-primary" href="profile">
                Profile
              </Dropdown.Item>
              <Dropdown.Item className="hover-primary" href="games">
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
              <Nav.Link href="/login">Login</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/signup">Sign Up</Nav.Link>
            </Nav.Item>
          </>
        )}
      </>
    </Nav>
  );
}

export default NavigationMenu;

// Imports
// import { useMediaQuery } from "react-responsive";
// Bootstrap components
import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/NavDropdown";
// Dev components
import Logo from "./Logo";

function NavigationMenu() {
  // In accordance with react-boostrap md breakpoint
  // const IS_MOBILE = useMediaQuery({ query: "(max-width: 768)" });

  return (
    <>
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
        <Nav.Item>
          <Nav.Link href="/login">Login</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/signup">Sign Up</Nav.Link>
        </Nav.Item>
      </Nav>
    </>
  );
}

export default NavigationMenu;

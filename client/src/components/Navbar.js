import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [showFashion, setShowFashion] = useState(false);
  const showDropdown = () => {
    setShow(!show);
  };
  const hideDropdown = () => {
    setShow(false);
  };
  const showDropdownFashion = () => {
    setShowFashion(!showFashion);
  };
  const hideDropdownFashion = () => {
    setShowFashion(false);
  };

  const handleCart = () => {
    navigate("/cart");
  };

  const handleprofile = () => {
    if (localStorage.getItem("user")) {
      const metamask = "metamask";
      const user = JSON.parse(localStorage.getItem("user"));
      if (metamask in user) {
        console.log(user);
      } else {
        console.log("here");
      }
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary m-1">
      <Container fluid className="mx-5">
        <Navbar.Brand href="/">Flipkart</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <NavDropdown
              title="Electronics"
              id="navbarScrollingDropdown"
              show={show}
              onMouseEnter={showDropdown}
              onMouseLeave={hideDropdown}
            >
              <NavDropdown.Item href="#action3">Audio</NavDropdown.Item>
              <NavDropdown.Item href="#action4">
                Health & Professional Care
              </NavDropdown.Item>
              <NavDropdown.Item href="/laptop">Laptop</NavDropdown.Item>
              <NavDropdown.Item href="/machine">
                Washing Machine
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title="Fashion"
              id="navbarScrollingDropdown"
              show={showFashion}
              onMouseEnter={showDropdownFashion}
              onMouseLeave={hideDropdownFashion}
            >
              <NavDropdown.Item href="#action3">Mens Wear</NavDropdown.Item>
              <NavDropdown.Item href="#action4">Womens Wear</NavDropdown.Item>
              <NavDropdown.Item href="#action6">Kids Wear</NavDropdown.Item>
              <NavDropdown.Item href="#action5">Footwear</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/guideline">Sikka</Nav.Link>
          </Nav>
          <Form className="d-flex col-md-4">
            <Form.Control
              type="search"
              placeholder="Search for Products"
              className="me-2"
              aria-label="Search"
            />
            {/* <Button variant="outline-success">Search</Button> */}
          </Form>
          <Nav className="d-flex">
            {
              location.pathname === "/profile" ? (
                <Button
                className="shadow-none"
                variant="light"
                onClick={handleLogout}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="1.25em" viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/></svg>
              </Button>
              ) :
                (<Button
                className="shadow-none"
                variant="light"
                onClick={handleprofile}
                >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1.25em"
                  viewBox="0 0 448 512"
                  >
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                </svg>
              </Button>)
            }
            <Button
              className="shadow-none"
              variant="light"
              onClick={handleCart}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1.25em"
                viewBox="0 0 576 512"
              >
                <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
              </svg>
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default Header;

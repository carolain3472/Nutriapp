import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Navbar, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export function NavbarComponent() {
  return (
    <div className="App">
      <Navbar bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="/nutricion.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
            NutriChat
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">
              Inicio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/chat">
              Chat
            </Nav.Link>
            <Nav.Link as={NavLink} to="/terminos">
              Términos
            </Nav.Link>
            <Nav.Link as={NavLink} to="/interes">
              Info de interés
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
}
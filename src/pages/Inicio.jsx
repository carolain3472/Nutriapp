import "bootstrap/dist/css/bootstrap.min.css";
import { NavbarComponent } from "../components/Navbar";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';



export function InicioPage() {
  return (
    <div className="App">
      <NavbarComponent />
      <Container fluid>
        <Row style={{ backgroundColor: "lightgray" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ order: 1, padding: "2em", display: "flex", alignItems: "center", flexDirection: "column" }}>
              <h2 style={{ textAlign: "justify" }}>Descubre un enfoque innovador hacia la salud y el bienestar con NutriSalud. No se trata solo de comer, se trata de nutrir tu cuerpo y vivir una vida plena. Aquí, te ofrecemos las herramientas y el apoyo que necesitas para alcanzar tus objetivos de salud de manera personalizada y sostenible.</h2>
              <Link to="/chat">
                <Button style={{ width: "20rem", marginTop: "1em" }} variant="outline-primary" size="lg">
                  Crea tu plan ahora
                </Button>
              </Link>
            </div>
            <div style={{ order: 2, marginLeft: "1em", padding: "1em" }}>
              <img
                src="/nutricionista.png"
                alt=""
                style={{ height: "512px", width: "512px" }}
              />
            </div>
          </div>
        </Row>
        <Row>
          <Col>
          <div style={{fontFamily: 'Oswald, sans-serif', order: 1, padding: "2em", display: "flex", alignItems: "center", flexDirection: "column", color:"blue"}}>
              <h2 style={{ textAlign: "justify", fontSize:"4.5rem" }}>SOMOS</h2>
              <h4 style={{ textAlign: "justify", fontSize:"2rem" }}>AQUELLO QUE</h4>
              <h1 style={{ textAlign: "justify", fontSize:"8rem" }}>COMEMOS</h1>
            </div>
          </Col>
          <Col style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
          <img
                src="/comidasana.png"
                alt=""
                style={{ height: "512px", width: "512px" }}
              />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

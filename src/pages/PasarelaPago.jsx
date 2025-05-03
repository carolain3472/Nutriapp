import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

export function PaymentGateway() {
  const navigate = useNavigate();
  const { plan } = useLocation().state || {};
  const [data, setData] = useState({
    number: "",
    name: "",
    docType: "CC",
    docNumber: "",
    city: "",
    department: "",
    address: "",
    country: "",
    postalCode: "",
    expiry: "",
    cvc: "",
    focused: "",
  });
  const [paid, setPaid] = useState(false);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });
  const handleFocus = (e) => setData({ ...data, focused: e.target.name });
  const handleSubmit = (e) => {
    e.preventDefault();
    setPaid(true);
  };
  const handleCancel = () => navigate(-1);

  if (paid) {
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center vh-100 p-3"
      >
        <Card
          className="shadow-lg rounded-3 p-4 text-center w-100"
          style={{ maxWidth: 400 }}
        >
          <Alert variant="success">
            <Alert.Heading>¡Pago simulado exitoso!</Alert.Heading>
            <p>
              Gracias por elegir el plan <b>{plan}</b>.
            </p>
          </Alert>
          <Button variant="success" onClick={() => navigate("/")}>
            Volver al inicio
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card
        className="mx-auto shadow-lg rounded-3 p-4"
        style={{ maxWidth: 900, maxHeight: "100vh", overflowY: "auto" }}
      >
        <h2 className="text-center mb-4">Pago: {plan}</h2>
        <Form onSubmit={handleSubmit}>
          <Row className="g-4">
            <Col xs={12} md={6} className="d-flex flex-column">
              <Card className="border-0 flex-fill">
                <Card.Header className="bg-transparent px-0 pb-2">
                  <h5>Facturación</h5>
                </Card.Header>
                <Card.Body
                  className="px-0 overflow-auto"
                  style={{ maxHeight: "60vh" }}
                >
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre Completo</Form.Label>
                    <Form.Control
                      name="name"
                      value={data.name}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo de Documento</Form.Label>
                    <Form.Select
                      name="docType"
                      value={data.docType}
                      onChange={handleChange}
                    >
                      <option value="CC">Cédula de Ciudadanía</option>
                      <option value="TI">Tarjeta de Identidad</option>
                      <option value="PP">Pasaporte</option>
                      <option value="CE">Cédula de Extranjería</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Número de Documento</Form.Label>
                    <Form.Control
                      name="docNumber"
                      value={data.docNumber}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control
                      name="address"
                      value={data.address}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Ciudad</Form.Label>
                    <Form.Control
                      name="city"
                      value={data.city}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Departamento</Form.Label>
                    <Form.Control
                      name="department"
                      value={data.department}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>País</Form.Label>
                    <Form.Control
                      name="country"
                      value={data.country}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Código Postal</Form.Label>
                    <Form.Control
                      name="postalCode"
                      value={data.postalCode}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Plan Escogido</Form.Label>
                    <Form.Control name="plan" value={plan} readOnly />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={6} className="d-flex flex-column">
              <Card className="border-0 flex-fill">
                <Card.Header className="bg-transparent px-0 pb-2">
                  <h5>Método de Pago</h5>
                </Card.Header>
                <Card.Body
                  className="px-0 overflow-auto"
                  style={{ maxHeight: "60vh" }}
                >
                  <div className="d-flex justify-content-center mb-3">
                    <Cards
                      number={data.number}
                      name={data.name}
                      expiry={data.expiry}
                      cvc={data.cvc}
                      focused={data.focused}
                    />
                  </div>
                  <Form.Group className="mb-3">
                    <Form.Label>Número de tarjeta</Form.Label>
                    <Form.Control
                      name="number"
                      value={data.number}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      placeholder="1234 5678 9123 0000"
                      required
                    />
                  </Form.Group>
                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>Expiración</Form.Label>
                        <Form.Control
                          name="expiry"
                          value={data.expiry}
                          onChange={handleChange}
                          onFocus={handleFocus}
                          placeholder="MM/AA"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>CVC</Form.Label>
                        <Form.Control
                          name="cvc"
                          value={data.cvc}
                          onChange={handleChange}
                          onFocus={handleFocus}
                          placeholder="CVC"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="d-flex flex-column flex-sm-row justify-content-end mt-4">
            <Button
              variant="danger"
              onClick={handleCancel}
              className="mb-2 mb-sm-0 me-sm-2 w-100 w-sm-auto"
            >
              Cancelar
            </Button>
            <Button variant="success" type="submit" className="w-100 w-sm-auto">
              Pagar
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

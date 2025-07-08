import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí podrías agregar validaciones básicas de frontend
    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok) {
      const user = result.user;

      // Al hacer login exitoso:

      localStorage.removeItem("token");
      localStorage.setItem("token", result.token);

      localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(user));
      
      // Redirigir basado en si el cuestionario fue completado
      if (user.hasCompletedQuestionnaire) {
        navigate("/dashboard");
      } else {
        navigate("/questionnaire");
      }
    } else {
      setError(result.message || "Error al iniciar sesión");
    }

  } catch (err) {
      console.error("Error al conectar con el backend:", err);
      setError("Error de red. Verifica tu conexión.");
    }

  };

  return (
    <Container
      fluid
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "#ececec" }}
    >
      <Row className="w-100 justify-content-center px-3">
        <Col xs={12} sm={10} md={8} lg={5} xl={4}>
          <Card
            className="border-0 shadow-lg"
            style={{ borderRadius: "16px", backgroundColor: "#fdfdfd" }}
          >
            <Card.Body className="p-5">
              {/* Volver al inicio */}
              <Button
                variant="link"
                href="/"
                className="p-0 mb-4 d-flex align-items-center text-secondary"
              >
                ← Volver al inicio
              </Button>

              {/* Logo + título */}
              <div className="d-flex align-items-center justify-content-center mb-3">
                <img
                  src="/logoApp.png"
                  alt="Logo NutriApp"
                  width={48}
                  height={48}
                  className="me-2"
                />
                <h1
                  className="text-success fw-bold mb-0"
                  style={{ fontSize: "2.5rem" }}
                >
                  NutriApp
                </h1>
              </div>

              <Card.Subtitle
                as="h2"
                className="text-center mb-4 text-muted"
                style={{ fontSize: "1.25rem" }}
              >
                Iniciar sesión
              </Card.Subtitle>

              <Form onSubmit={handleSubmit}>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <Form.Group className="mb-4" controlId="email">
                  <Form.Label className="fw-semibold">
                    Correo electrónico
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    size="lg"
                    style={{ borderRadius: "12px" }}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label className="fw-semibold">Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="••••••••"
                    size="lg"
                    style={{ borderRadius: "12px" }}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Button
                  variant="dark"
                  type="submit"
                  className="w-100 rounded-pill py-2 mb-3"
                  style={{ fontSize: "1.1rem" }}
                >
                  Iniciar sesión
                </Button>
              </Form>

              <div className="d-flex justify-content-between small">
                <a
                  href="#recuperar"
                  className="text-decoration-none text-secondary"
                >
                  ¿Olvidaste tu contraseña?
                </a>
                <a
                  href="/#planes"
                  className="text-decoration-none text-secondary"
                >
                  Adquiere un plan
                </a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

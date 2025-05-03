import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../styles/Inicio.css";

export function InicioPage() {
  const navigate = useNavigate();

  const handleCheckout = (plan) => {
    // Simple navegación a la página de checkout en modo visual
    navigate("/checkout", { state: { plan } });
  };

  return (
    <>
      <Navbar className="bg-body-secondary fixed-top" expand="lg">
        <Container>
          <Navbar.Brand href="#inicio">
            <img
              alt="Logo de NutriApp"
              src="/logoApp.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
            <b>NutriApp</b>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#inicio">Inicio</Nav.Link>
              <Nav.Link href="#que-es">¿Qué es?</Nav.Link>
              <Nav.Link href="#planes">Planes</Nav.Link>
              <Nav.Link href="/login">Iniciar sesión</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main>
        <section id="inicio" className="section">
          <Container>
            <Row className="align-items-center justify-content-center">
              {/* Columna de texto */}
              <Col md={6}>
                <h1 className="display-4 fw-bold">
                  Nutrición Inteligente con IA
                </h1>
                <p className="lead mt-3">
                  Descubre cómo la inteligencia artificial puede ayudarte a
                  alcanzar tus objetivos de salud y bienestar con planes
                  nutricionales personalizados. Transforma tu alimentación con
                  planes creados por inteligencia artificial, pensados 100% para
                  ti.
                </p>
                <p className="mt-4 text-muted">
                  Sin consultas. Sin complicaciones. Solo resultados.
                </p>
                <Row className="mt-5">
                  <Col className="text-center">
                    <Button
                      href="#planes"
                      variant="success"
                      size="lg"
                      className="rounded-pill"
                    >
                      Comienza Aquí 🚀
                    </Button>
                  </Col>
                </Row>
              </Col>

              {/* Columna de imagen */}
              <Col md={6} className="text-center">
                <img
                  src="/nutricionInicio.jpeg"
                  alt="Nutrición Inteligente"
                  className="img-fluid rounded"
                />
              </Col>
            </Row>
          </Container>
        </section>

        <section id="que-es" className="py-5 bg-light">
          <Container>
            <Row className="align-items-center justify-content-center">
              <Col md={12}>
                <h2 className="display-4 fw-bold text-center">
                  ¿Qué es NutriApp? 🧠
                </h2>
                <p className="lead mt-3 text-center">
                  NutriApp es tu asistente de nutrición inteligente, diseñado
                  para transformar tu alimentación diaria con la ayuda de la
                  inteligencia artificial.
                </p>
                <p className="mt-4 text-center">
                  Ya sea que busques optimizar tu salud, mejorar tu rendimiento
                  físico o gestionar las necesidades alimenticias de tu familia,
                  NutriApp se adapta a ti.
                </p>
              </Col>
            </Row>

            <Row className="mt-5 justify-content-center">
              <Col md={4} className="text-center">
                <h3 className="fw-bold">Profesionales Ocupados ⏰</h3>
                <p>
                  Para quienes el tiempo es limitado y la eficiencia es clave.
                  NutriApp ofrece soluciones automatizadas que se ajustan a tu
                  ritmo de vida.
                </p>
              </Col>
              <Col md={4} className="text-center">
                <h3 className="fw-bold">Entusiastas del Fitness 💪</h3>
                <p>
                  Aquellos que buscan maximizar su rendimiento con planes
                  alimenticios precisos. NutriApp proporciona seguimiento
                  detallado y ajustes personalizados.
                </p>
              </Col>
              <Col md={4} className="text-center">
                <h3 className="fw-bold">
                  Familias con Restricciones Alimenticias 👨‍👩‍👧‍👦
                </h3>
                <p>
                  Hogares que requieren menús personalizados y equilibrados para
                  todos sus miembros. NutriApp organiza y adapta la alimentación
                  familiar de manera eficiente.
                </p>
              </Col>
            </Row>

            <Row className="mt-5 justify-content-center">
              <Col md={8}>
                <h3 className="fw-bold text-center">
                  Características Destacadas ✨
                </h3>
                <ul className="list-unstyled mt-3 text-center">
                  <li>
                    <strong>Automatización de Planes Nutricionales:</strong>{" "}
                    Generación automática de menús adaptados a tus objetivos y
                    restricciones.
                  </li>
                  <li>
                    <strong>Recordatorios Personalizados:</strong> Alertas para
                    ayudarte a mantener tus hábitos alimenticios sin esfuerzo.
                  </li>
                  <li>
                    <strong>Listas de Compras Integradas:</strong>{" "}
                    Sincronización directa con tus menús para facilitar tus
                    compras.
                  </li>
                  <li>
                    <strong>Seguimiento de Progreso:</strong> Monitoreo
                    detallado de tu evolución para ajustes precisos.
                  </li>
                </ul>
              </Col>
            </Row>
          </Container>
        </section>
        <section id="planes" className="py-5">
          <Container>
            <h2 className="display-4 text-center mb-5">
              Nuestros Planes Nutricionales
            </h2>

            <Row className="justify-content-center">
              {/* Plan Básico */}
              <Col md={4}>
                <div className="plan-card">
                  <h3 className="plan-title">🍃 Plan Básico (Gratis)</h3>
                  <ul className="plan-features">
                    <li>✅ Plan alimenticio semanal simple</li>
                    <li>⚠️ Restricciones básicas</li>
                    <li>🍽️ Hasta 3 recetas semanales</li>
                    <li>⏰ Recordatorios básicos</li>
                    <li>📚 Tips y artículos generales</li>
                  </ul>
                  <Button
                    variant="outline-success"
                    className="w-100 mt-3"
                    onClick={() => handleCheckout("Básico")}
                  >
                    Seleccionar Plan Básico
                  </Button>
                </div>
              </Col>

              {/* Plan Estándar */}
              <Col md={4}>
                <div className="plan-card">
                  <h3 className="plan-title">🥦 Plan Estándar (13.000 COP)</h3>
                  <ul className="plan-features">
                    <li>🎯 Plan personalizado con objetivos</li>
                    <li>🔄 Menús dinámicos</li>
                    <li>🍳 Recetas ilimitadas</li>
                    <li>🛒 Listas de compras completas</li>
                    <li>📈 Registro de progreso</li>
                    <li>🤖 Recordatorios inteligentes</li>
                  </ul>
                  <Button
                    variant="outline-success"
                    className="w-100 mt-3"
                    onClick={() => handleCheckout("Estándar")}
                  >
                    Seleccionar Plan Estándar
                  </Button>
                </div>
              </Col>

              {/* Plan Premium */}
              <Col md={4}>
                <div className="plan-card">
                  <h3 className="plan-title">🌟 Plan Premium (20.000 COP)</h3>
                  <ul className="plan-features">
                    <li>✅ Todo lo del estándar</li>
                    <li>👨‍👩‍👧‍👦 Multiusuario</li>
                    <li>🥗 Gestión avanzada de alergias</li>
                    <li>🧠 Análisis con IA</li>
                    <li>📊 Reportes visuales</li>
                    <li>💬 Asistencia personalizada</li>
                  </ul>
                  <Button
                    variant="outline-success"
                    className="w-100 mt-3"
                    onClick={() => handleCheckout("Premium")}
                  >
                    Seleccionar Plan Premium
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    </>
  );
}

import React, { useEffect, useState } from "react";
import "../styles/Recetas.css";
import { Container, Row, Col, Card, Badge, ListGroup, Button, ButtonGroup } from "react-bootstrap";
import { Sidebar } from "../components/SideBar";
import recetasData from "../data/recetas.json";

function consolidarAlergenos(ingredientes) {
  const alertas = ingredientes.flatMap((i) => i.alergenos);
  return [...new Set(alertas)];
}

export function Recetas() {
  const [recetas, setRecetas] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [filtro, setFiltro] = useState("Todas");

  useEffect(() => {
    const enriquecidas = recetasData.map((receta) => ({
      ...receta,
      alergenos: consolidarAlergenos(receta.ingredientes),
    }));
    setRecetas(enriquecidas);
  }, []);

  const recetasFiltradas = filtro === "Todas"
    ? recetas
    : recetas.filter((r) => (r.tipo || "").toLowerCase() === filtro.toLowerCase());

  const receta = recetasFiltradas[indiceActual] || null;

  const handleAnterior = () => {
    if (indiceActual > 0) setIndiceActual(indiceActual - 1);
  };

  const handleSiguiente = () => {
    if (indiceActual < recetasFiltradas.length - 1) setIndiceActual(indiceActual + 1);
  };

  const cambiarFiltro = (nuevoFiltro) => {
    setFiltro(nuevoFiltro);
    setIndiceActual(0);
  };

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col xs={12} md={3} lg={2} className="p-0">
          <Sidebar />
        </Col>

        <Col xs={12} md={9} lg={10} className="p-4">
          <h1 className="mb-4 text-center">Recetas Saludables</h1>

          <div className="d-flex justify-content-center mb-4">
            <ButtonGroup>
              {['Todas', 'Desayuno', 'Almuerzo', 'Cena'].map((tipo) => (
                <Button
                  key={tipo}
                  variant={filtro === tipo ? "primary" : "outline-primary"}
                  onClick={() => cambiarFiltro(tipo)}
                >
                  {tipo}
                </Button>
              ))}
            </ButtonGroup>
          </div>

          {receta && (
            <Card className="shadow-lg border-0 p-3 mx-auto" style={{ maxWidth: "900px" }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start flex-wrap">
                  <div>
                    <Card.Title className="fs-2">{receta.nombre}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {receta.descripcion}
                    </Card.Subtitle>
                  </div>
                  <div className="text-end">
                    <Badge bg="secondary" className="me-1">{receta.tipo || "General"}</Badge>
                    <Badge bg="info">{receta.tiempo || "Tiempo N/D"}</Badge>
                  </div>
                </div>

                <hr />

                <Row>
                  <Col md={6}>
                    <h6>Ingredientes:</h6>
                    <ListGroup variant="flush">
                      {receta.ingredientes.map((ing, idx) => (
                        <ListGroup.Item key={idx}>
                          {ing.nombre} – {ing.cantidad}
                          {ing.alergenos.length > 0 && (
                            <span className="ms-2 text-danger">
                              ({ing.alergenos.join(", ")})
                            </span>
                          )}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Col>
                  <Col md={6}>
                    <h6>Paso a paso:</h6>
                    <ol>
                      {receta.pasos.map((paso, idx) => (
                        <li key={idx}>{paso}</li>
                      ))}
                    </ol>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col>
                    <h6>Información nutricional:</h6>
                    <ul className="list-unstyled mb-0">
                      <li><strong>Calorías:</strong> {receta.nutricion?.calorias || receta.calorias} kcal</li>
                      {receta.nutricion && (
                        <>
                          <li><strong>Proteínas:</strong> {receta.nutricion.proteinas} g</li>
                          <li><strong>Carbohidratos:</strong> {receta.nutricion.carbohidratos} g</li>
                          <li><strong>Grasas:</strong> {receta.nutricion.grasas} g</li>
                        </>
                      )}
                    </ul>
                  </Col>
                  <Col>
                    <h6>Alergenos:</h6>
                    {receta.alergenos.length > 0 ? (
                      receta.alergenos.map((a, i) => (
                        <Badge key={i} bg="danger" className="me-1">
                          {a}
                        </Badge>
                      ))
                    ) : (
                      <Badge bg="success">Ninguno</Badge>
                    )}
                  </Col>
                </Row>

                <div className="d-flex justify-content-between mt-4">
                  <Button variant="outline-primary" onClick={handleAnterior} disabled={indiceActual === 0}>
                    ← Anterior
                  </Button>
                  <span className="text-muted">
                    Receta {recetasFiltradas.length > 0 ? indiceActual + 1 : 0} de {recetasFiltradas.length}
                  </span>
                  <Button variant="outline-primary" onClick={handleSiguiente} disabled={indiceActual >= recetasFiltradas.length - 1}>
                    Siguiente →
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

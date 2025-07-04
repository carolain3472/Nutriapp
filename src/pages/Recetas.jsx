import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Sidebar } from '../components/SideBar';

export function Recetas() {
  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Columna del Sidebar */}
        <Col xs={12} md={3} lg={2} className="p-0">
          <Sidebar />
        </Col>

        {/* Columna de Contenido */}
        <Col xs={12} md={9} lg={10} className="p-4">
          <h1>Recetas</h1>
          <p>Aquí encontrarás todas las recetas disponibles.</p>

        </Col>
      </Row>
    </Container>
  );
}

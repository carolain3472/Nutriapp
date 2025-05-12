import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Sidebar } from '../components/SideBar';

export function Perfil() {
  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Columna del Sidebar */}
        <Col xs={12} md={3} lg={2} className="p-0">
          <Sidebar userName="Usuario" />
        </Col>

        {/* Columna de Contenido */}
        <Col xs={12} md={9} lg={10} className="p-4">
          <h1>Perfil</h1>
          <p>Bienvenido a la página de perfil.</p>
          {/* Aquí coloca el resto de tu contenido */}
        </Col>
      </Row>
    </Container>
  );
}
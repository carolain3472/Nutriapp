import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Sidebar } from '../components/SideBar';
import { ChatBot } from '../components/ChatBot';

export function Nutrichat() {
  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Columna del Sidebar */}
        <Col xs={12} md={3} lg={2} className="p-0">
          <Sidebar userName="Usuario" />
        </Col>

        {/* Columna de Contenido */}
        <Col xs={12} md={9} lg={10} className="p-4">
          <div className="mb-4">
            <h1 className="display-5 fw-bold text-dark mb-3">NutriChat</h1>
            <p className="lead text-muted">
              Tu asistente nutricional inteligente. Consulta sobre planes de alimentación, 
              recetas y consejos nutricionales personalizados.
            </p>
          </div>

          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <ChatBot />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
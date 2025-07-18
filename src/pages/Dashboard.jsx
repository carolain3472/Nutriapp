import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { Sidebar } from '../components/SideBar';

export function Dashboard() {
  // eslint-disable-next-line
  const [currentDate, setCurrentDate] = useState(new Date());
  // eslint-disable-next-line
  const [dailyCalories, setDailyCalories] = useState(0);
  const [favoriteMeals] = useState([
    { name: 'Ensalada César', calories: 350 },
    { name: 'Pollo a la Parrilla', calories: 450 },
    { name: 'Salmón con Verduras', calories: 550 }
  ]);
  const [mealCount] = useState({
    breakfast: 1,
    lunch: 1,
    dinner: 1,
    snacks: 2
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const cardStyle = {
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease-in-out',
    border: 'none',
    height: '100%'
  };

  const cardHoverStyle = {
    ...cardStyle,
    transform: 'translateY(-5px)'
  };

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Columna del Sidebar */}
        <Col xs={12} md={3} lg={2} className="p-0">
          <Sidebar />
        </Col>

        {/* Columna de Contenido */}
        <Col xs={12} md={9} lg={10} className="p-4" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
          <h2 className="mb-4" style={{ color: '#2c3e50', fontWeight: 'bold' }}>
            Dashboard Nutricional
          </h2>

          <Row className="g-3">
            {/* Fecha Actual */}
            <Col xs={12} md={6} lg={3}>
              <Card 
                style={cardStyle}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
              >
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <div 
                      className="me-3 d-flex align-items-center justify-content-center"
                      style={{ 
                        fontSize: '40px', 
                        color: '#3498db',
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#e3f2fd',
                        borderRadius: '50%'
                      }}
                    >
                      📅
                    </div>
                    <h6 className="mb-0">Fecha Actual</h6>
                  </div>
                  <h5 className="text-muted">
                    {currentDate.toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h5>
                </Card.Body>
              </Card>
            </Col>

            {/* Calorías Diarias */}
            <Col xs={12} md={6} lg={3}>
              <Card 
                style={cardStyle}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
              >
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <div 
                      className="me-3 d-flex align-items-center justify-content-center"
                      style={{ 
                        fontSize: '40px', 
                        color: '#e74c3c',
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#ffebee',
                        borderRadius: '50%'
                      }}
                    >
                      📈
                    </div>
                    <h6 className="mb-0">Calorías Diarias</h6>
                  </div>
                  <h4 className="text-muted">
                    {dailyCalories} kcal
                  </h4>
                </Card.Body>
              </Card>
            </Col>

            {/* Comidas del Día */}
            <Col xs={12} md={6} lg={3}>
              <Card 
                style={cardStyle}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
              >
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <div 
                      className="me-3 d-flex align-items-center justify-content-center"
                      style={{ 
                        fontSize: '40px', 
                        color: '#2ecc71',
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#e8f5e8',
                        borderRadius: '50%'
                      }}
                    >
                      🍽️
                    </div>
                    <h6 className="mb-0">Comidas del Día</h6>
                  </div>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between align-items-center border-0 px-0">
                      <span>Desayuno</span>
                      <span className="text-muted">{mealCount.breakfast} comida(s)</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center border-0 px-0">
                      <span>Almuerzo</span>
                      <span className="text-muted">{mealCount.lunch} comida(s)</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center border-0 px-0">
                      <span>Cena</span>
                      <span className="text-muted">{mealCount.dinner} comida(s)</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center border-0 px-0">
                      <span>Snacks</span>
                      <span className="text-muted">{mealCount.snacks} comida(s)</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            {/* Comidas Favoritas */}
            <Col xs={12} md={6} lg={3}>
              <Card 
                style={cardStyle}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
              >
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <div 
                      className="me-3 d-flex align-items-center justify-content-center"
                      style={{ 
                        fontSize: '40px', 
                        color: '#e84393',
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#fce4ec',
                        borderRadius: '50%'
                      }}
                    >
                      ❤️
                    </div>
                    <h6 className="mb-0">Comidas Favoritas</h6>
                  </div>
                  <ListGroup variant="flush">
                    {favoriteMeals.map((meal, index) => (
                      <ListGroup.Item 
                        key={index} 
                        className="d-flex align-items-center border-0 px-0"
                      >
                        <span 
                          className="me-2"
                          style={{ color: '#e84393', fontSize: '20px' }}
                        >
                          🍽️
                        </span>
                        <div>
                          <div>{meal.name}</div>
                          <small className="text-muted">{meal.calories} kcal</small>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

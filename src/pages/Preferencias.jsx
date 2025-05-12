import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Sidebar } from '../components/SideBar';

export function Preferencias() {
  const [preferences, setPreferences] = useState({
    goal: 'balanced',
    allergies: [],
    intolerances: [],
    mealsPerDay: 3,
    dietType: 'omnivore'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setPreferences(prev => ({
        ...prev,
        [name]: checked ? [...prev[name], value] : prev[name].filter(v => v !== value)
      }));
    } else {
      setPreferences(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Preferencias guardadas:', preferences);
  };

  const allergyOptions = [
    { value: 'gluten', label: 'Gluten' },
    { value: 'dairy', label: 'Lácteos' },
    { value: 'nuts', label: 'Frutos secos' },
    { value: 'shellfish', label: 'Mariscos' },
    { value: 'soy', label: 'Soja' }
  ];

  const intoleranceOptions = [
    { value: 'lactose', label: 'Lactosa' },
    { value: 'fructose', label: 'Fructosa' },
    { value: 'histamine', label: 'Histamina' },
    { value: 'fodmap', label: 'FODMAP' }
  ];

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col xs={12} md={3} lg={2} className="p-0">
          <Sidebar userName="Usuario" />
        </Col>
        <Col xs={12} md={9} lg={10} className="p-4">
          <h1>Preferencias Alimenticias</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="goal">
              <Form.Label>Objetivo nutricional</Form.Label>
              <Form.Select name="goal" value={preferences.goal} onChange={handleChange}>
                <option value="balanced">Dieta equilibrada</option>
                <option value="weight_loss">Perder peso</option>
                <option value="weight_gain">Ganar peso</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4" controlId="dietType">
              <Form.Label>Tipo de dieta</Form.Label>
              <Form.Select name="dietType" value={preferences.dietType} onChange={handleChange}>
                <option value="omnivore">Omnívoro</option>
                <option value="vegetarian">Vegetariano</option>
                <option value="vegan">Vegano</option>
                <option value="keto">Cetogénica</option>
                <option value="paleo">Paleo</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4" controlId="allergies">
              <Form.Label>Alergias</Form.Label>
              {allergyOptions.map(opt => (
                <Form.Check
                  type="checkbox"
                  name="allergies"
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                  checked={preferences.allergies.includes(opt.value)}
                  onChange={handleChange}
                  className="mb-2"
                />
              ))}
            </Form.Group>

            <Form.Group className="mb-4" controlId="intolerances">
              <Form.Label>Intolerancias</Form.Label>
              {intoleranceOptions.map(opt => (
                <Form.Check
                  type="checkbox"
                  name="intolerances"
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                  checked={preferences.intolerances.includes(opt.value)}
                  onChange={handleChange}
                  className="mb-2"
                />
              ))}
            </Form.Group>

            <Form.Group className="mb-4" controlId="mealsPerDay">
              <Form.Label>Comidas por día</Form.Label>
              <Form.Control
                type="number"
                name="mealsPerDay"
                min={1}
                max={6}
                value={preferences.mealsPerDay}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="success" type="submit">
              Guardar Preferencias
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
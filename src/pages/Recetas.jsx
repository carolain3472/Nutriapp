import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert, Accordion } from 'react-bootstrap';
import { Sidebar } from '../components/SideBar';

export function Recetas() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRecipes = useCallback(async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Debes iniciar sesión para ver las recetas.');
        setLoading(false);
        return;
      }
      
      const url = query ? `/api/recipes?search=${encodeURIComponent(query)}` : '/api/recipes';
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Error al cargar las recetas');
      }

      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecipes(searchQuery);
  };

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col xs={12} md={3} lg={2} className="p-0">
          <Sidebar />
        </Col>
        <Col xs={12} md={9} lg={10} className="p-4" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
          <h1 className="mb-4">Recetas Personalizadas</h1>

          <Form onSubmit={handleSearch} className="mb-4">
            <Row>
              <Col md={10}>
                <Form.Control 
                  type="text" 
                  placeholder="Busca recetas por ingrediente, nombre, etc."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Col>
              <Col md={2}>
                <Button variant="primary" type="submit" className="w-100">Buscar</Button>
              </Col>
            </Row>
          </Form>

          {loading && (
            <div className="text-center">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
              <p>Generando recetas personalizadas...</p>
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && recipes.length === 0 && (
            <Alert variant="info">No se encontraron recetas. Intenta con otra búsqueda o más tarde.</Alert>
          )}

          {!loading && !error && recipes.length > 0 && (
            <Accordion alwaysOpen>
              {recipes.map((recipe, index) => (
                <Accordion.Item eventKey={String(index)} key={index} className="mb-3">
                  <Accordion.Header>{recipe.title}</Accordion.Header>
                  <Accordion.Body>
                    <p><strong>Descripción:</strong> {recipe.description}</p>
                    
                    <Row>
                      <Col md={6}>
                        <h5>Ingredientes</h5>
                        <ul>
                          {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                        </ul>
                      </Col>
                      <Col md={6}>
                        <h5>Información Nutricional</h5>
                        {recipe.nutrition && (
                          <ul>
                            <li><strong>Calorías:</strong> {recipe.nutrition.calories}</li>
                            <li><strong>Proteínas:</strong> {recipe.nutrition.protein}</li>
                            <li><strong>Carbohidratos:</strong> {recipe.nutrition.carbs}</li>
                            <li><strong>Grasas:</strong> {recipe.nutrition.fats}</li>
                          </ul>
                        )}
                      </Col>
                    </Row>

                    <h5>Instrucciones</h5>
                    <ol>
                      {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          )}
        </Col>
      </Row>
    </Container>
  );
}

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Sidebar } from "../components/SideBar";

export function Preferencias() {
  const [formData, setFormData] = useState({
    objetivo: "",
    requerimientosSalud: "",
    peso: "",
    estatura: "",
    edad: "",
    tipoDieta: "",
    alergias: "",
    intolerancias: "",
    comidasPorDia: "",
    grupoAlimentosPreferido: [],
    alimentosFavoritos: "",
    platillosFavoritos: "",
    restriccionesReligiosas: "",
    detalleRestriccionReligiosa: "",
  });
  const [initialWeight, setInitialWeight] = useState("");

  useEffect(() => {
    // Cargar las preferencias del usuario al montar el componente
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      if (user.preferences) {
        setFormData(user.preferences);
      }
      if (user.pesoInicial) {
        setInitialWeight(user.pesoInicial);
      } else if (user.preferences && user.preferences.peso) {
        // Si no hay peso inicial, usar el de preferencias como fallback
        setInitialWeight(user.preferences.peso);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        grupoAlimentosPreferido: checked
          ? [...prev.grupoAlimentosPreferido, value]
          : prev.grupoAlimentosPreferido.filter((item) => item !== value),
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No estás autenticado. Por favor, inicia sesión de nuevo.");
      // Opcional: podrías redirigir al login
      // navigate('/login');
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/preferences",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        // Actualizar el usuario en localStorage con las nuevas preferencias
        const user = JSON.parse(localStorage.getItem("user"));
        user.preferences = result.user.preferences;
        localStorage.setItem("user", JSON.stringify(user));

        alert("Preferencias actualizadas con éxito");
      } else {
        const error = await response.json();
        alert(`Error al guardar tus preferencias: ${error.message}`);
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("No se pudo conectar con el servidor. Inténtalo más tarde.");
    }
  };

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col xs={12} md={3} lg={2} className="p-0">
          <Sidebar />
        </Col>
        <Col
          xs={12}
          md={9}
          lg={10}
          className="p-4"
          style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}
        >
          <h1 className="mb-4">Preferencias y Datos Personales</h1>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="objetivo">
                  <Form.Label>Objetivo Principal</Form.Label>
                  <Form.Select
                    name="objetivo"
                    value={formData.objetivo}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona uno</option>
                    <option value="bajar">Bajar de peso</option>
                    <option value="subir">Subir de peso</option>
                    <option value="mantener">Mantener peso</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="requerimientosSalud">
                  <Form.Label>Requerimientos de salud</Form.Label>
                  <Form.Control
                    type="text"
                    name="requerimientosSalud"
                    value={formData.requerimientosSalud}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="pesoInicial">
                  <Form.Label>Peso Inicial (kg)</Form.Label>
                  <Form.Control
                    type="number"
                    name="pesoInicial"
                    value={initialWeight}
                    readOnly
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="peso">
                  <Form.Label>Peso Actual (kg)</Form.Label>
                  <Form.Control
                    type="number"
                    name="peso"
                    value={formData.peso}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="estatura">
                  <Form.Label>Estatura (cm)</Form.Label>
                  <Form.Control
                    type="number"
                    name="estatura"
                    value={formData.estatura}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="tipoDieta">
                  <Form.Label>Tipo de Dieta</Form.Label>
                  <Form.Select
                    name="tipoDieta"
                    value={formData.tipoDieta}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona una</option>
                    <option value="omnivora">Omnívora</option>
                    <option value="vegetariana">Vegetariana</option>
                    <option value="vegana">Vegana</option>
                    <option value="pescetariana">Pescetariana</option>
                    <option value="otra">Otra</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="comidasPorDia">
                  <Form.Label>Comidas por día</Form.Label>
                  <Form.Select
                    name="comidasPorDia"
                    value={formData.comidasPorDia}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona una</option>
                    <option value="3">3 comidas</option>
                    <option value="4">4 comidas</option>
                    <option value="5">5 comidas</option>
                    <option value="otro">Otro</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="restriccionesReligiosas">
              <Form.Label>Restricciones Religiosas</Form.Label>
              <Form.Select
                name="restriccionesReligiosas"
                value={formData.restriccionesReligiosas}
                onChange={handleChange}
              >
                <option value="">Selecciona una</option>
                <option value="ninguna">Ninguna</option>
                <option value="halal">Halal</option>
                <option value="kosher">Kosher</option>
                <option value="hindu">Hindú (sin res)</option>
                <option value="budista">
                  Budista (sin carne, sin ajo/cebolla)
                </option>
                <option value="otra">Otra</option>
              </Form.Select>
            </Form.Group>

            {formData.restriccionesReligiosas === "otra" && (
              <Form.Group
                className="mb-3"
                controlId="detalleRestriccionReligiosa"
              >
                <Form.Label>Especificar restricción religiosa</Form.Label>
                <Form.Control
                  type="text"
                  name="detalleRestriccionReligiosa"
                  value={formData.detalleRestriccionReligiosa || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3" controlId="alergias">
              <Form.Label>Alergias</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="alergias"
                value={formData.alergias}
                onChange={handleChange}
                placeholder="Ej: Maní, mariscos..."
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="intolerancias">
              <Form.Label>Intolerancias</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="intolerancias"
                value={formData.intolerancias}
                onChange={handleChange}
                placeholder="Ej: Lactosa, gluten..."
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="grupoAlimentosPreferido">
              <Form.Label>Grupos de alimentos preferidos</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="checkbox"
                  name="grupoAlimentosPreferido"
                  label="Frutas"
                  value="frutas"
                  checked={formData.grupoAlimentosPreferido.includes("frutas")}
                  onChange={handleChange}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  name="grupoAlimentosPreferido"
                  label="Verduras"
                  value="verduras"
                  checked={formData.grupoAlimentosPreferido.includes(
                    "verduras"
                  )}
                  onChange={handleChange}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  name="grupoAlimentosPreferido"
                  label="Proteínas"
                  value="proteinas"
                  checked={formData.grupoAlimentosPreferido.includes(
                    "proteinas"
                  )}
                  onChange={handleChange}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  name="grupoAlimentosPreferido"
                  label="Carbohidratos"
                  value="carbohidratos"
                  checked={formData.grupoAlimentosPreferido.includes(
                    "carbohidratos"
                  )}
                  onChange={handleChange}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  name="grupoAlimentosPreferido"
                  label="Grasas saludables"
                  value="grasas"
                  checked={formData.grupoAlimentosPreferido.includes("grasas")}
                  onChange={handleChange}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="alimentosFavoritos">
              <Form.Label>Alimentos Favoritos</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="alimentosFavoritos"
                value={formData.alimentosFavoritos}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="platillosFavoritos">
              <Form.Label>Platillos Favoritos</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="platillosFavoritos"
                value={formData.platillosFavoritos}
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

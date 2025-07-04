import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image"; // Para mostrar la foto de perfil

/**
 * Calcula la edad en años completos a partir de una fecha ISO (YYYY-MM-DD).
 */
function calculateAge(birthDateString) {
  if (!birthDateString) return "";
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function PaymentGateway() {
  const navigate = useNavigate();
  const { plan } = useLocation().state || {}; // Plan que viene por props
  // Estado global de datos (tanto perfil como pago)
  const [data, setData] = useState({
    // CAMPOS DE PERFIL (registro)
    photoFile: null, // Archivo de foto
    photoPreview: "", // URL para vista previa
    name: "",
    lastName: "",
    birthDate: "",
    height: "",
    weight: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    // CAMPOS DE FACTURACIÓN 
    docType: "CC",
    docNumber: "",
    city: "",
    department: "",
    address: "",
    country: "",
    postalCode: "",
    // CAMPOS DE PAGO 
    number: "",
    expiry: "",
    cvc: "",
    focused: "",
  });

  // Control de flujo: registrarse antes de pagar
  const [registered, setRegistered] = useState(false);
  // Control de “pago simulado exitoso”
  const [paid, setPaid] = useState(false);

  /**
   * Actualiza el estado `data` al cambiar cualquier input.
   * @param {Event} e
   */
  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  /**
   * Marca el campo actual enfocado para el componente <Cards/>.
   * @param {Event} e
   */
  const handleFocus = (e) => setData({ ...data, focused: e.target.name });

  /**
   * Maneja la selección de foto de perfil: guarda el archivo y genera vista previa.
   * @param {Event} e
   */
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData((prev) => ({
          ...prev,
          photoFile: file,
          photoPreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const enviarRegistro = async () => {
    const formData = new FormData();

    formData.append("nombre", data.name);
    formData.append("apellidos", data.lastName);
    formData.append("fecha_nacimiento", data.birthDate);
    formData.append("altura", data.height);
    formData.append("peso", data.weight);
    formData.append("genero", data.gender);
    formData.append("email", data.email);
    formData.append("password", data.password);

    if (data.photoFile) {
      formData.append("foto_perfil", data.photoFile);
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Registro exitoso");
        setRegistered(true); // avanzar al formulario de pago
      } else {
        alert(`Error: ${result.error || "No se pudo registrar"}`);
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Ocurrió un error al registrar el usuario");
    }
  };


  /**
   * Al enviar el formulario de REGISTRO (perfil), validamos y avanzamos a pago.
   * @param {Event} e
   */
  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    
    await enviarRegistro(); // hace el POST al backend
  };

  /**
   * Al enviar el formulario de PAGO, simulamos pago exitoso.
   * @param {Event} e
   */
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setPaid(true);
  };

  /**
   * Volver atrás (o logout, según convenga).
   */
  const handleCancel = () => navigate(-1);

  // Si el pago ya se hizo, mostramos pantalla de confirmación
  if (paid) {
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center vh-100 p-3"
      >
        <Card
          className="shadow-lg rounded-3 p-4 text-center w-100"
          style={{ maxWidth: 400 }}
        >
          <Alert variant="success">
            <Alert.Heading>¡Pago simulado exitoso!</Alert.Heading>
            <p>
              Gracias por elegir el plan <b>{plan}</b>, {data.name}{" "}
              {data.lastName}.
            </p>
          </Alert>
          <Button
            variant="success"
            onClick={() =>
              navigate("/login")
            }
          >
            Iniciar sesión
          </Button>
        </Card>
      </Container>
    );
  }

  // Si aún no se registró, mostramos formulario de REGISTRO (perfil)
  if (!registered) {
    return (
      <Container className="py-5">
        <Card
          className="mx-auto shadow-lg rounded-3 p-4"
          style={{ maxWidth: 700 }}
        >
          <h2 className="text-center mb-4">Registro de Usuario</h2>
          <Form onSubmit={handleRegistrationSubmit}>
            <Row className="g-4">
              {/* FOTO DE PERFIL */}
              <Col xs={12} className="text-center">
                <Form.Group className="mb-3">
                  <Form.Label>Foto de Perfil</Form.Label>
                  <div className="d-flex justify-content-center mb-2">
                    {data.photoPreview ? (
                      <Image
                        src={data.photoPreview}
                        alt="Vista previa"
                        roundedCircle
                        style={{ width: 150, height: 150, objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 150,
                          height: 150,
                          borderRadius: "50%",
                          backgroundColor: "#f0f0f0",
                        }}
                      />
                    )}
                  </div>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    name="photo"
                    onChange={handlePhotoChange}
                  />
                </Form.Group>
              </Col>

              {/* NOMBRE */}
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              {/* APELLIDOS */}
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellidos</Form.Label>
                  <Form.Control
                    name="lastName"
                    value={data.lastName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              {/* FECHA DE NACIMIENTO */}
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Nacimiento</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthDate"
                    value={data.birthDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              {/* EDAD (solo lectura, calculada) */}
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Edad</Form.Label>
                  <Form.Control
                    type="text"
                    value={calculateAge(data.birthDate)}
                    readOnly
                    plaintext
                  />
                </Form.Group>
              </Col>

              {/* ALTURA */}
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Altura (cm)</Form.Label>
                  <Form.Control
                    type="number"
                    name="height"
                    value={data.height}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>

              {/* PESO */}
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Peso (kg)</Form.Label>
                  <Form.Control
                    type="number"
                    name="weight"
                    value={data.weight}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Confirmar Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={data.confirmPassword}
                    onChange={handleChange}
                    required
                    isInvalid={data.confirmPassword && data.password !== data.confirmPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    Las contraseñas no coinciden.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* GÉNERO */}
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Género</Form.Label>
                  <Form.Select
                    name="gender"
                    value={data.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="secondary"
                onClick={handleCancel}
                className="me-2"
              >
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Continuar a Pago
              </Button>
            </div>
          </Form>
        </Card>
      </Container>
    );
  }

  // Si ya se registró, mostramos formulario de PAGO
  return (
    <Container className="py-5">
      <Card
        className="mx-auto shadow-lg rounded-3 p-4"
        style={{ maxWidth: 900, maxHeight: "100vh", overflowY: "auto" }}
      >
        <h2 className="text-center mb-4">Pago: {plan}</h2>
        <Form onSubmit={handlePaymentSubmit}>
          <Row className="g-4">
            {/* FACTURACIÓN (básico) */}
            <Col xs={12} md={6} className="d-flex flex-column">
              <Card className="border-0 flex-fill">
                <Card.Header className="bg-transparent px-0 pb-2">
                  <h5>Facturación</h5>
                </Card.Header>
                <Card.Body
                  className="px-0 overflow-auto"
                  style={{ maxHeight: "60vh" }}
                >
                  {/* Nombre completo (se carga desde el registro) */}
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre Completo</Form.Label>
                    <Form.Control
                      name="name"
                      value={`${data.name} ${data.lastName}`}
                      readOnly
                      plaintext
                    />
                  </Form.Group>

                  {/* Tipo de Documento */}
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo de Documento</Form.Label>
                    <Form.Select
                      name="docType"
                      value={data.docType}
                      onChange={handleChange}
                    >
                      <option value="CC">Cédula de Ciudadanía</option>
                      <option value="TI">Tarjeta de Identidad</option>
                      <option value="PP">Pasaporte</option>
                      <option value="CE">Cédula de Extranjería</option>
                    </Form.Select>
                  </Form.Group>

                  {/* Número de Documento */}
                  <Form.Group className="mb-3">
                    <Form.Label>Número de Documento</Form.Label>
                    <Form.Control
                      name="docNumber"
                      value={data.docNumber}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  {/* Dirección */}
                  <Form.Group className="mb-3">
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control
                      name="address"
                      value={data.address}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  {/* Ciudad */}
                  <Form.Group className="mb-3">
                    <Form.Label>Ciudad</Form.Label>
                    <Form.Control
                      name="city"
                      value={data.city}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  {/* Departamento */}
                  <Form.Group className="mb-3">
                    <Form.Label>Departamento</Form.Label>
                    <Form.Control
                      name="department"
                      value={data.department}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  {/* País */}
                  <Form.Group className="mb-3">
                    <Form.Label>País</Form.Label>
                    <Form.Control
                      name="country"
                      value={data.country}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  {/* Código Postal */}
                  <Form.Group className="mb-3">
                    <Form.Label>Código Postal</Form.Label>
                    <Form.Control
                      name="postalCode"
                      value={data.postalCode}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  {/* Plan Escogido (solo lectura) */}
                  <Form.Group className="mb-3">
                    <Form.Label>Plan Escogido</Form.Label>
                    <Form.Control name="plan" value={plan} readOnly />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>

            {/* MÉTODO DE PAGO */}
            <Col xs={12} md={6} className="d-flex flex-column">
              <Card className="border-0 flex-fill">
                <Card.Header className="bg-transparent px-0 pb-2">
                  <h5>Método de Pago</h5>
                </Card.Header>
                <Card.Body
                  className="px-0 overflow-auto"
                  style={{ maxHeight: "60vh" }}
                >
                  <div className="d-flex justify-content-center mb-3">
                    <Cards
                      number={data.number}
                      name={`${data.name} ${data.lastName}`}
                      expiry={data.expiry}
                      cvc={data.cvc}
                      focused={data.focused}
                    />
                  </div>
                  <Form.Group className="mb-3">
                    <Form.Label>Número de tarjeta</Form.Label>
                    <Form.Control
                      name="number"
                      value={data.number}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      placeholder="1234 5678 9123 0000"
                      required
                    />
                  </Form.Group>
                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>Expiración</Form.Label>
                        <Form.Control
                          name="expiry"
                          value={data.expiry}
                          onChange={handleChange}
                          onFocus={handleFocus}
                          placeholder="MM/AA"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>CVC</Form.Label>
                        <Form.Control
                          name="cvc"
                          value={data.cvc}
                          onChange={handleChange}
                          onFocus={handleFocus}
                          placeholder="CVC"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Botones Cancelar / Pagar */}
          <div className="d-flex flex-column flex-sm-row justify-content-end mt-4">
            <Button
              variant="danger"
              onClick={handleCancel}
              className="mb-2 mb-sm-0 me-sm-2 w-100 w-sm-auto"
            >
              Cancelar
            </Button>
            <Button variant="success" type="submit" className="w-100 w-sm-auto">
              Pagar
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

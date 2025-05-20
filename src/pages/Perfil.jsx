import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Image,
  Spinner,
} from 'react-bootstrap';
import { Sidebar } from '../components/SideBar';
import { useLocation } from 'react-router-dom';
import "../styles/Perfil.css"; // Asegúrate de tener este archivo CSS

export function Perfil() {
  // Estado para almacenar datos del usuario
  const [userData, setUserData] = useState({
    photoUrl: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    height: '',
    weight: '',
    gender: '',
  });

  // Estado para la nueva foto y su vista previa
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  // Estados de manejo de carga y resultado de guardado
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null); // null | true | false

  const location = useLocation();

  // Simular fetch de datos del usuario desde la base de datos
  useEffect(() => {
  if (location.state && location.state.user) {
    const user = location.state.user;
    setUserData({
      photoUrl: user.photoUrl || 'https://via.placeholder.com/200',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      birthDate: user.birthDate || '',
      height: user.height || '',
      weight: user.weight || '',
      gender: user.gender || '',
      age: user.age || '',
    });
    setPhotoPreview(user.photoUrl || 'https://via.placeholder.com/200');
  } else {
    // fallback: simulación o fetch desde backend si no se pasó por navegación
    const mockUser = {
      photoUrl: 'https://via.placeholder.com/200',
      firstName: 'Ana',
      lastName: 'García',
      birthDate: '1992-11-03',
      height: 168,
      weight: 60,
      gender: 'Femenino',
    };
    setUserData(mockUser);
    setPhotoPreview(mockUser.photoUrl);
  }
}, [location.state]);

  // Maneja cambio en el campo de peso
  const handleWeightChange = (e) => {
    setUserData((prev) => ({
      ...prev,
      weight: e.target.value,
    }));
  };

  // Maneja selección de nuevo archivo de foto
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhotoFile(file);
      // Generar vista previa local con FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Función que se dispara al hacer click en "Guardar cambios"
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(null);

    try {
      // Construir FormData con peso y foto (si cambia)
      const formData = new FormData();
      formData.append('weight', userData.weight);
      if (newPhotoFile) {
        formData.append('photo', newPhotoFile);
      }
      // Ejemplo de llamada a la API (ajusta la ruta según tu backend)
      const response = await fetch('/api/user/update-profile', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Error al guardar cambios');
      }
      // La API puede devolver la nueva URL de foto y/o el peso actualizado
      const updated = await response.json();
      setUserData((prev) => ({
        ...prev,
        photoUrl: updated.photoUrl || prev.photoUrl,
        weight: updated.weight || prev.weight,
      }));
      setNewPhotoFile(null);
      setSaveSuccess(true);
    } catch (error) {
      console.error(error);
      setSaveSuccess(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Columna del Sidebar: no se modifica aquí */}
        <Col xs={12} md={3} lg={2} className="p-0">
          <Sidebar userName={`${userData.firstName} ${userData.lastName}`} />
        </Col>

        {/* Columna de Contenido: aplicamos solo los estilos de contenido de perfil */}
        <Col xs={12} md={9} lg={10} className="p-4">
          <div className="perfil-content">
            <h1>Mi Perfil</h1>

            <Form onSubmit={handleSave} className="perfil-form">
              <Row className="align-items-center">
                <Col xs={12} md={4} className="text-center mb-4 mb-md-0">
                  {/* Vista previa de la foto */}
                  <Image
                    src={photoPreview || 'https://via.placeholder.com/200'}
                    className="perfil-avatar mb-3"
                    roundedCircle
                    fluid
                  />
                  <Form.Group controlId="formPhoto">
                    <Form.Label className="form-label">
                      Cambiar foto de perfil
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={8}>
                  {/* Nombre (solo lectura) */}
                  <Form.Group as={Row} controlId="formFirstName" className="mb-3">
                    <Form.Label column sm={4} className="form-label">
                      Nombre
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="text"
                        value={userData.firstName}
                        readOnly
                        
                      />
                    </Col>
                  </Form.Group>

                  {/* Apellidos (solo lectura) */}
                  <Form.Group as={Row} controlId="formLastName" className="mb-3">
                    <Form.Label column sm={4} className="form-label">
                      Apellidos
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="text"
                        value={userData.lastName}
                        readOnly
                        
                      />
                    </Col>
                  </Form.Group>

                  {/* Fecha de nacimiento (solo lectura) */}
                  <Form.Group as={Row} controlId="formBirthDate" className="mb-3">
                    <Form.Label column sm={4} className="form-label">
                      Fecha de Nacimiento
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="date"
                        value={userData.birthDate}
                        readOnly
                      />
                    </Col>
                  </Form.Group>

                  {/* Edad (calculada, solo lectura) */}
                  <Form.Group as={Row} controlId="formAge" className="mb-3">
                    <Form.Label column sm={4} className="form-label">
                      Edad
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="text"
                        value={userData.age}
                        readOnly
                        
                      />
                    </Col>
                  </Form.Group>

                  {/* Altura (solo lectura) */}
                  <Form.Group as={Row} controlId="formHeight" className="mb-3">
                    <Form.Label column sm={4} className="form-label">
                      Altura (cm)
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="number"
                        value={userData.height}
                        readOnly
                        
                      />
                    </Col>
                  </Form.Group>

                  {/* Género (solo lectura) */}
                  <Form.Group as={Row} controlId="formGender" className="mb-3">
                    <Form.Label column sm={4} className="form-label">
                      Género
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="text"
                        value={userData.gender}
                        readOnly
                        
                      />
                    </Col>
                  </Form.Group>

                  {/* Peso (editable) */}
                  <Form.Group as={Row} controlId="formWeight" className="mb-3">
                    <Form.Label column sm={4} className="form-label">
                      Peso (kg)
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="number"
                        value={userData.weight}
                        onChange={handleWeightChange}
                        min="0"
                        step="0.1"
                        required
                      />
                    </Col>
                  </Form.Group>
                </Col>
              </Row>

              {/* Botón de guardar */}
              <Row className="mt-4">
                <Col className="text-end">
                  <Button
                    variant="dark"
                    type="submit"
                    className="btn-guardar"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Guardando...
                      </>
                    ) : (
                      'Guardar cambios'
                    )}
                  </Button>
                </Col>
              </Row>

              {/* Mensaje de éxito o error */}
              {saveSuccess === true && (
                <Row className="mt-3">
                  <Col>
                    <div className="alert alert-success" role="alert">
                      ¡Tus cambios se han guardado correctamente!
                    </div>
                  </Col>
                </Row>
              )}
              {saveSuccess === false && (
                <Row className="mt-3">
                  <Col>
                    <div className="alert alert-danger" role="alert">
                      Ocurrió un error al guardar los cambios. Intenta de
                      nuevo más tarde.
                    </div>
                  </Col>
                </Row>
              )}
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

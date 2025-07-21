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
import "../styles/Perfil.css";

export function Perfil() {

  const [refreshUser, setRefreshUser] = useState(false);

  const [userData, setUserData] = useState({
    photoUrl: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    height: '',
    weight: '',
    gender: '',
  });

  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const location = useLocation();

  function calculateAge(fechaNacimiento) {
    if (!fechaNacimiento) return '';
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData({
        photoUrl: user.fotoUrl ? `http://localhost:5000${user.fotoUrl}` : '',
        firstName: user.nombre || '',
        lastName: user.apellidos || '',
        birthDate: user.fecha_nacimiento?.slice(0, 10) || '',
        height: user.altura || '',
        weight: user.peso || '',
        gender: user.genero || '',
        age: calculateAge(user.fecha_nacimiento),
      });
      setPhotoPreview(user.fotoUrl ? `http://localhost:5000${user.fotoUrl}` : '');
    }
  }, [location.state, refreshUser]); // ← incluye refreshUser


  const handleWeightChange = (e) => {
    setUserData((prev) => ({
      ...prev,
      weight: e.target.value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(null);

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const formData = new FormData();
      formData.append('weight', userData.weight);
      formData.append('userId', storedUser.id);

      if (newPhotoFile) {
        formData.append('photo', newPhotoFile);
      }

      const response = await fetch('https://nutriapp-0agf.onrender.com/api/auth/update-profile', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al guardar cambios');
      }

      const updated = await response.json();

      // 👇 Verifica que photoUrl viene del backend y lo actualizas
      const updatedPhotoUrl = updated.photoUrl
        ? `https://nutriapp-0agf.onrender.com${updated.photoUrl}` // Evitar caché
        : userData.photoUrl;

      setUserData((prev) => ({
        ...prev,
        photoUrl: updatedPhotoUrl,
        weight: updated.weight || prev.weight,
      }));
      setPhotoPreview(updatedPhotoUrl);

      // 🔄 ACTUALIZAR localStorage
      const updatedUser = {
        ...storedUser,
        peso: updated.weight || storedUser.peso,
        fotoUrl: updated.photoUrl || storedUser.fotoUrl, // ← esto es clave
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setRefreshUser(prev => !prev); 


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
        <Col xs={12} md={3} lg={2} className="p-0">
          <Sidebar userName={`${userData.firstName} ${userData.lastName}`} />
        </Col>

        <Col xs={12} md={9} lg={10} className="p-4">
          <div className="perfil-content">
            <h1>Mi Perfil</h1>

            <Form onSubmit={handleSave} className="perfil-form">
              <Row className="align-items-center">
                <Col xs={12} md={4} className="text-center mb-4 mb-md-0">
                  <Image
                    src={photoPreview || 'https://via.placeholder.com/200'}
                    className="perfil-avatar mb-3"
                    roundedCircle
                    fluid
                  />
                  <Form.Group controlId="formPhoto">
                    <Form.Label className="form-label">Cambiar foto de perfil</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={8}>
                  <Form.Group as={Row} controlId="formFirstName" className="mb-3">
                    <Form.Label column sm={4} className="form-label">Nombre</Form.Label>
                    <Col sm={8}>
                      <Form.Control type="text" value={userData.firstName} readOnly />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId="formLastName" className="mb-3">
                    <Form.Label column sm={4} className="form-label">Apellidos</Form.Label>
                    <Col sm={8}>
                      <Form.Control type="text" value={userData.lastName} readOnly />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId="formBirthDate" className="mb-3">
                    <Form.Label column sm={4} className="form-label">Fecha de Nacimiento</Form.Label>
                    <Col sm={8}>
                      <Form.Control type="date" value={userData.birthDate} readOnly />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId="formAge" className="mb-3">
                    <Form.Label column sm={4} className="form-label">Edad</Form.Label>
                    <Col sm={8}>
                      <Form.Control type="text" value={userData.age} readOnly />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId="formHeight" className="mb-3">
                    <Form.Label column sm={4} className="form-label">Altura (cm)</Form.Label>
                    <Col sm={8}>
                      <Form.Control type="number" value={userData.height} readOnly />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId="formGender" className="mb-3">
                    <Form.Label column sm={4} className="form-label">Género</Form.Label>
                    <Col sm={8}>
                      <Form.Control type="text" value={userData.gender} readOnly />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} controlId="formWeight" className="mb-3">
                    <Form.Label column sm={4} className="form-label">Peso (kg)</Form.Label>
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

              <Row className="mt-4">
                <Col className="text-end">
                  <Button variant="dark" type="submit" className="btn-guardar" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                        Guardando...
                      </>
                    ) : (
                      'Guardar cambios'
                    )}
                  </Button>
                </Col>
              </Row>

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
                      Ocurrió un error al guardar los cambios. Intenta de nuevo más tarde.
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

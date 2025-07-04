import React, { useState, useEffect } from "react";
import { Offcanvas, Button, Nav, Image } from "react-bootstrap";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

export function Sidebar({ userName }) {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState(userName || "");
  useEffect(() => {
    if (userName) {
      setName(userName);
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setName(`${user.nombre} ${user.apellidos}`);
      } else {
        setName("Usuario");
      }
    }
  }, [userName]);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/recetas", label: "Recetas" },
    { to: "/nutrichat", label: "Nutrichat" },
    { to: "/preferencias", label: "Preferencias" },
  ];

  // Determina índice activo solo entre las opciones listadas
  const activeIndex = links.findIndex(link => link.to === location.pathname);
  const itemHeight = 40; // Ajusta según padding/height de nav-link

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const renderLinks = () => (
    <div className="position-relative" style={{ paddingTop: '4px' }}>
      {/* Si activeIndex >=0 renderiza highlight en la opción seleccionada */}
      {activeIndex >= 0 && (
        <div
          className="position-absolute bg-white rounded w-100"
          style={{
            height: `${itemHeight}px`,
            transform: `translateY(${activeIndex * itemHeight}px)`,
            transition: 'transform 0.5s ease-in-out',
            zIndex: 1,
          }}
        />
      )}
      <Nav className="flex-column text-center position-relative" style={{ zIndex: 2 }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) =>
              `nav-link rounded px-3 py-2 ${isActive ? 'text-dark' : 'text-white'}`
            }
            style={{ transition: 'color 0.3s ease' }}
            onClick={handleClose}
          >
            {link.label}
          </NavLink>
        ))}
      </Nav>
    </div>
  );

  // Componente perfil clicable
  const ProfileSection = () => {
    const [profilePic, setProfilePic] = useState('');

    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.fotoUrl) {
          setProfilePic(`http://localhost:5000${user.fotoUrl}`);
        }
      } else {
        console.log("error con la imagen")
      }
    }, []);

    return (
      <div
        className="text-center mb-4 cursor-pointer"
        onClick={() => {
          navigate("/perfil");
          handleClose();
        }}
        style={{ cursor: "pointer" }}
      >
        <Image
          src={profilePic}
          roundedCircle
          width={80}
          height={80}
          className="mb-2"
          onError={(e) => {
            e.target.onerror = null;
          }}
        />
        <div>Bienvenid@</div>
        <strong>{name}</strong>
      </div>
    );
  };


  return (
    <>
      <Button
        variant="dark"
        onClick={handleShow}
        className="d-md-none m-2"
      >
        <span className="navbar-toggler-icon"></span>
      </Button>

      <Offcanvas show={show} onHide={handleClose} backdrop={false}>
        <Offcanvas.Header closeButton closeVariant="white" className="bg-dark">
          <Offcanvas.Title className="text-white">Menú</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="bg-dark text-white d-flex flex-column p-3" style={{ height: '100%' }}>
          <ProfileSection />

          <div className="flex-grow-1">
            {renderLinks()}
          </div>

          <Nav.Link
            onClick={handleLogout}
            className="nav-link rounded text-white text-center mt-auto px-3 py-2"
            style={{ transition: 'color 0.3s ease' }}
          >
            Cerrar sesión
          </Nav.Link>
        </Offcanvas.Body>
      </Offcanvas>

      <div
        className="d-none d-md-flex flex-column bg-dark text-white vh-100 position-fixed p-3"
        style={{ width: "220px" }}
      >
        <ProfileSection />

        <div className="flex-grow-1">
          {renderLinks()}
        </div>

        <Nav.Link
          onClick={handleLogout}
          className="nav-link rounded text-white text-center mt-auto px-3 py-2"
          style={{ transition: 'color 0.3s ease' }}
        >
          Cerrar sesión
        </Nav.Link>
      </div>

      <div className="ms-md-" style={{ marginLeft: "220px" }}></div>
    </>
  );
}

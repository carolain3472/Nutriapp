import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { Sidebar } from '../components/SideBar';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

// Helper function to format dates
const formatDate = (date) => new Date(date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });

export function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'weight', 'meal', 'activity'

    // Form states
    const [weight, setWeight] = useState('');
    const [mealName, setMealName] = useState('');
    const [mealCalories, setMealCalories] = useState('');
    const [mealType, setMealType] = useState('breakfast');
    const [caloriesBurned, setCaloriesBurned] = useState('');
    const [activeHours, setActiveHours] = useState('');
    const [sleepHours, setSleepHours] = useState('');

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            // Asegúrate de que el token exista
            if (!token) {
                // Manejar caso sin token, e.g., redirigir a login
                return;
            }
            const res = await fetch('/api/dashboard/data', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setDashboardData(data);
            } else {
                console.error('Error fetching dashboard data:', data.message);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

  useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchData();
        }
    }, []);

    const handleShowModal = (type) => {
        setModalType(type);
        setShowModal(true);
    };
    
    const resetFormFields = () => {
        setWeight('');
        setMealName('');
        setMealCalories('');
        setMealType('breakfast');
        setCaloriesBurned('');
        setActiveHours('');
        setSleepHours('');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetFormFields();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        let endpoint = '';
        let body = {};

        switch (modalType) {
            case 'weight':
                endpoint = '/api/dashboard/weight';
                body = { weight: parseFloat(weight) };
                break;
            case 'meal':
                endpoint = '/api/dashboard/meal';
                body = { name: mealName, calories: parseInt(mealCalories), type: mealType };
                break;
            case 'activity':
                // This will require multiple API calls as per the current backend design
                // For now, let's just handle one part of it. A better backend would handle this in one go.
                if (caloriesBurned) {
                    await fetch('/api/dashboard/calories-burned', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ calories: parseInt(caloriesBurned) })
                    });
                }
                if (activeHours) {
                     await fetch('/api/dashboard/active-hours', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ hours: parseFloat(activeHours) })
                    });
                }
                if (sleepHours) {
                    await fetch('/api/dashboard/sleep-hours', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ hours: parseFloat(sleepHours) })
                    });
                }
                fetchData(); // Refresh data
                handleCloseModal();
                return; // Exit function
            default:
                return;
        }

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                fetchData(); // Refresh data on success
                // Actualizar localStorage para mantener la consistencia
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    if (modalType === 'weight') {
                        user.peso = body.weight;
                        if (!user.pesoInicial) {
                            user.pesoInicial = body.weight;
                        }
                        if (user.preferences) {
                            user.preferences.peso = body.weight;
                        }
                    }
                    localStorage.setItem('user', JSON.stringify(user));
                }
                handleCloseModal();
            } else {
                const errorData = await res.json();
                console.error(`Error submitting ${modalType}:`, errorData.message);
                // Optionally: show an error message to the user
            }
        } catch (error) {
            console.error(`Error submitting ${modalType}:`, error);
        }
    };

    // --- Data Processing ---
    const latestWeight = dashboardData?.peso || 0;
    const initialWeight = dashboardData?.pesoInicial || latestWeight;
    
    const calculateBMI = (weight, height) => {
        if (!weight || !height) return 0;
        const weightNum = parseFloat(weight);
        const heightNum = parseFloat(height);
        if(isNaN(weightNum) || isNaN(heightNum) || heightNum === 0) return 0;

        const heightInMeters = heightNum / 100;
        return (weightNum / (heightInMeters * heightInMeters)).toFixed(2);
    };
    const bmi = dashboardData ? calculateBMI(latestWeight, dashboardData.altura) : 0;
    
    const getTodayData = (history) => {
        const today = new Date().toISOString().split('T')[0];
        return history
            ?.filter(entry => entry.date.startsWith(today))
            .reduce((acc, curr) => acc + (curr.calories || curr.hours || 0), 0) || 0;
    };

    const caloriesConsumedToday = getTodayData(dashboardData?.mealHistory);
    const caloriesBurnedToday = getTodayData(dashboardData?.caloriesBurnedHistory);

    // --- Chart Data & Options ---
    const weightChartData = {
        labels: dashboardData?.weightHistory?.map(entry => formatDate(entry.date)) || [],
        datasets: [{
            label: 'Peso (kg)',
            data: dashboardData?.weightHistory?.map(entry => entry.weight) || [],
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.5)',
            fill: true,
        }],
    };

    const caloriesChartData = {
        labels: ['Consumidas', 'Quemadas'],
        datasets: [{
            data: [caloriesConsumedToday, caloriesBurnedToday],
            backgroundColor: ['#2ecc71', '#e74c3c'],
        }],
    };
    
    const getLast7DaysData = (history, dataKey) => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        return last7Days.map(day => {
            const dayData = history
                ?.filter(entry => entry.date.startsWith(day))
                .reduce((acc, curr) => acc + curr[dataKey], 0) || 0;
            return dayData;
        });
    }

    const activityChartData = {
        labels: [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6-i));
            return formatDate(d);
        }),
        datasets: [
            {
                label: 'Horas de Actividad',
                data: dashboardData ? getLast7DaysData(dashboardData.activeHoursHistory, 'hours') : [],
                backgroundColor: '#f1c40f',
            },
            {
                label: 'Horas de Sueño',
                data: dashboardData ? getLast7DaysData(dashboardData.sleepHoursHistory, 'hours') : [],
                backgroundColor: '#9b59b6',
            }
        ],
    };

  const cardStyle = {
    borderRadius: '15px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    border: 'none',
        height: '100%',
        backgroundColor: '#ffffff'
    };
    
    // --- Render Logic ---
    const renderModalBody = () => {
        switch (modalType) {
            case 'weight':
                return (
                    <Form.Group>
                        <Form.Label>Peso Actual (kg)</Form.Label>
                        <Form.Control type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="Ej: 75.5" />
                    </Form.Group>
                );
            case 'meal':
                return (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre del Platillo</Form.Label>
                            <Form.Control type="text" value={mealName} onChange={e => setMealName(e.target.value)} placeholder="Ej: Ensalada César" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Calorías</Form.Label>
                            <Form.Control type="number" value={mealCalories} onChange={e => setMealCalories(e.target.value)} placeholder="Ej: 350" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Tipo de Comida</Form.Label>
                            <Form.Select value={mealType} onChange={e => setMealType(e.target.value)}>
                                <option value="breakfast">Desayuno</option>
                                <option value="lunch">Almuerzo</option>
                                <option value="dinner">Cena</option>
                                <option value="snack">Snack</option>
                            </Form.Select>
                        </Form.Group>
                    </>
                );
            case 'activity':
                return (
                    <>
                         <Form.Group className="mb-3">
                            <Form.Label>Calorías Quemadas</Form.Label>
                            <Form.Control type="number" value={caloriesBurned} onChange={e => setCaloriesBurned(e.target.value)} placeholder="Ej: 300" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Horas de Actividad</Form.Label>
                            <Form.Control type="number" value={activeHours} onChange={e => setActiveHours(e.target.value)} placeholder="Ej: 1.5" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Horas de Sueño</Form.Label>
                            <Form.Control type="number" value={sleepHours} onChange={e => setSleepHours(e.target.value)} placeholder="Ej: 8" />
                        </Form.Group>
                    </>
                );
            default:
                return null;
        }
  };

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col xs={12} md={3} lg={2} className="p-0">
          <Sidebar />
        </Col>

                <Col xs={12} md={9} lg={10} className="p-4" style={{ backgroundColor: '#f4f7f6' }}>
                    <h2 className="mb-4" style={{ color: '#343a40', fontWeight: 'bold' }}>
                        Bienvenido, {dashboardData?.nombre || 'Usuario'}
          </h2>

                    {/* Action Buttons */}
                    <Row className="mb-4">
                        <Col>
                            <Button variant="primary" onClick={() => handleShowModal('meal')} className="me-2">Registrar Comida</Button>
                            <Button variant="success" onClick={() => handleShowModal('weight')} className="me-2">Registrar Peso</Button>
                            <Button variant="info" onClick={() => handleShowModal('activity')}>Registrar Actividad/Sueño</Button>
                        </Col>
                    </Row>
                    
                    {/* Key Metrics */}
                    <Row className="g-4 mb-4">
                        <Col md={4}>
                            <Card style={cardStyle}>
                                <Card.Body>
                                    <Card.Title>Peso Inicial</Card.Title>
                                    <Card.Text className="fs-2">{initialWeight} kg</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card style={cardStyle}>
                    <Card.Body>
                                    <Card.Title>Peso Actual</Card.Title>
                                    <Card.Text className="fs-2">{latestWeight} kg</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
                         <Col md={4}>
                            <Card style={cardStyle}>
                <Card.Body>
                                    <Card.Title>IMC</Card.Title>
                                    <Card.Text className="fs-2">{bmi}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
                        <Col md={4}>
                            <Card style={cardStyle}>
                <Card.Body>
                                    <Card.Title>Calorías (Hoy)</Card.Title>
                                    <div style={{ height: '120px', position: 'relative' }}>
                                        <Doughnut data={caloriesChartData} options={{ responsive: true, maintainAspectRatio: false, cutout: '70%' }}/>
                  </div>
                </Card.Body>
              </Card>
            </Col>
                    </Row>
                    
                    {/* Charts */}
                    <Row className="g-4">
                        <Col lg={12}>
                             <Card style={cardStyle}>
                <Card.Body>
                                    <Card.Title>Evolución del Peso</Card.Title>
                                    <div style={{height: '300px'}}>
                                        <Line data={weightChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
                        <Col lg={12}>
                             <Card style={cardStyle}>
                <Card.Body>
                                    <Card.Title>Actividad y Sueño</Card.Title>
                                     <div style={{height: '300px'}}>
                                        <Bar data={activityChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

            {/* Generic Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalType === 'weight' && 'Registrar Nuevo Peso'}
                        {modalType === 'meal' && 'Registrar Comida'}
                        {modalType === 'activity' && 'Registrar Actividad y Sueño'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        {renderModalBody()}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
                    <Button variant="primary" type="submit" onClick={handleSubmit}>Guardar Cambios</Button>
                </Modal.Footer>
            </Modal>
    </Container>
  );
}

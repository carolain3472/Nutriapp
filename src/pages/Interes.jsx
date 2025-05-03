import "bootstrap/dist/css/bootstrap.min.css";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';


export function InteresPage() {
    return (
        <div className="App">

            <Container fluid style={{marginTop:"1em"}}>
                <Row >
                    <div style={{ display: "flex", alignItems: "start" }}>
                        <div style={{ order: 1 }}>
                            <h5>Importancia de una Dieta Equilibrada:</h5>
                            <p>
                                Una dieta equilibrada proporciona los nutrientes esenciales que el cuerpo
                                necesita para funcionar correctamente. Incluye una variedad de alimentos
                                de todos los grupos alimenticios, como frutas, verduras, granos enteros,
                                proteínas magras y grasas saludables.
                            </p>
                        </div>
                        <div style={{ order: 2, marginRigth: "1em", padding: "1em" }}>
                            <img
                                src="/balancediet.png"
                                alt=""
                                style={{ height: "200px", width: "200px", objectFit: "cover", }}
                            />
                        </div>
                    </div>
                </Row>
                <Row style={{ backgroundColor: "lightgray" }}>
                    <div style={{ display: "flex", alignItems: "start" }}>
                        <div style={{ order: 2 }}>
                            <h5 style={{ textAlign: "end" }}>Efecto de los Nutrientes en la Salud:</h5>
                            <p style={{ textAlign: "end" }}>Los nutrientes tienen un impacto significativo en la salud. Por ejemplo, las vitaminas y minerales son clave para funciones como el sistema inmunológico, la formación de huesos y dientes, y la producción de energía. La falta o el exceso de ciertos nutrientes puede llevar a problemas de salud.
                            </p>
                        </div>
                        <div style={{ order: 1, marginLeft: "1em", padding: "1em" }}>
                            <img
                                src="/nutrisalud.webp"
                                alt=""
                                style={{ height: "200px", width: "200px", borderRadius: "50%" }}
                            />
                        </div>
                    </div>
                </Row>
                <Row>
                    <div style={{ display: "flex", alignItems: "start" }}>
                        <div style={{ order: 1 }}>
                            <h5 >Hidratación Adecuada:</h5>
                            <p>El agua es esencial para la vida y desempeña un papel fundamental en la digestión, absorción de nutrientes y eliminación de desechos. Mantenerse bien hidratado es crucial para el funcionamiento óptimo del cuerpo.
                            </p>
                        </div>
                        <div style={{ order: 2, marginRigth: "1em", padding: "1em" }}>
                            <img
                                src="hidratacion.jpg"
                                alt=""
                                style={{ height: "200px", width: "200px", border: "1px solid", borderRadius: "50%", objectFit: "cover", }}
                            />
                        </div>
                    </div>
                </Row>
                <Row style={{ backgroundColor: "lightgray" }}>
                    <div style={{ display: "flex", alignItems: "start" }}>
                        <div style={{ order: 2 }}>
                            <h5 style={{ textAlign: "end" }}>Impacto de los Hábitos Alimenticios en el Estado de Ánimo:</h5>
                            <p style={{ textAlign: "end" }}>La conexión entre la alimentación y el estado de ánimo es evidente. Una dieta balanceada y nutritiva puede influir positivamente en la salud mental. Por otro lado, los alimentos procesados y ricos en azúcares pueden tener efectos negativos en el bienestar emocional.</p>
                        </div>
                        <div style={{ order: 1, marginLeft: "1em", padding: "1em" }}>
                            <img
                                src="/animo.jpg"
                                alt=""
                                style={{
                                    height: "200px",
                                    width: "200px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                    </div>
                </Row>
            </Container>
        </div>
    );
}
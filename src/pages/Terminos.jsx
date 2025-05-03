import "bootstrap/dist/css/bootstrap.min.css";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";


export function TerminosPage() {
  return (
    <div className="App">

      <Container fluid>
        <Row>
          <h1 style={{ textAlign: "center", marginTop: "0.2em" }}>
            Términos de Uso para NutriChat
          </h1>
          <div style={{ textAlign: "justify", padding: "3em" }}>
            <span>
              <strong>
                <em>
                  <u>Última actualización: 11 de marzo de 2024</u>
                </em>
              </strong>
            </span>
            <p>
              Bienvenidos a NutriChat. Al acceder y utilizar nuestro sitio web y
              servicios, usted
              <strong>
                <em>(el "Usuario")</em>
              </strong>
              acepta estar sujeto a los siguientes términos y condiciones
              <strong>
                <em>(los "Términos de Uso")</em>
              </strong>
              . Si no está de acuerdo con estos términos, por favor, no utilice
              nuestros servicios.
            </p>
            <Row style={{ backgroundColor: "lightgray" }}>
              <h2 style={{ marginBottom: "0.5em" }}>
                1. Descripción del Servicio
              </h2>
              <p>
                NutriChat ofrece un servicio de chat basado en la inteligencia
                artificial ChatGPT 3.5 Turbo de OpenAI, diseñado para
                proporcionar información y sugerencias generales sobre
                nutrición. Este servicio está destinado a ser utilizado como una
                herramienta de apoyo y no reemplaza el consejo profesional
                médico, de nutrición o de salud.
              </p>
            </Row>
            <Row style={{ border: "1px solid" }}>
              <h2 style={{ marginBottom: "0.5em" }}>
                2. No es un Consejo Médico
              </h2>
              <p>
                La información y los servicios proporcionados a través de
                NutriChat son solo para fines informativos y educativos. No
                deben interpretarse como consejo médico, diagnóstico o
                tratamiento. Siempre debe consultar con un profesional de la
                salud calificado antes de tomar decisiones basadas en su salud,
                dieta o bienestar.
              </p>
            </Row>
            <Row style={{ backgroundColor: "lightgray" }}>
              <h2 style={{ marginBottom: "0.5em" }}>
                3. Limitación de Responsabilidad
              </h2>
              <p>
                NutriChat y sus desarrolladores no son responsables de ninguna
                decisión tomada o acción llevada a cabo basada en la información
                proporcionada por este servicio. Es su responsabilidad
                asegurarse de que cualquier información obtenida a través de
                nuestro chat sea adecuada y verificada por un profesional de la
                salud.
              </p>
            </Row>
            <Row style={{ border: "1px solid" }}>
              <h2 style={{ marginBottom: "0.5em" }}>
                4. Cambios en los Términos de Uso
              </h2>
              <p>
                Nos reservamos el derecho de modificar estos términos en
                cualquier momento. Cualquier cambio será efectivo inmediatamente
                después de su publicación en nuestro sitio web. Su uso
                continuado de nuestros servicios constituye su aceptación de
                estos cambios.
              </p>
            </Row>
            <Row style={{ backgroundColor: "lightgray" }}>
              <h2 style={{ marginBottom: "0.5em" }}>5. Uso Aceptable</h2>
              <p>
                Al utilizar NutriChat, usted se compromete a no usar el servicio
                para fines ilícitos o prohibidos por estos Términos. Usted no
                debe usar NutriChat de manera que pueda dañar, deshabilitar,
                sobrecargar o deteriorar el servicio, o interferir con el uso y
                disfrute del servicio por parte de otros usuarios.
              </p>
            </Row>
            <Row style={{ border: "1px solid" }}>
              <h2 style={{ marginBottom: "0.5em" }}>6. Contacto</h2>
              <p>
                Si tiene preguntas o preocupaciones sobre estos Términos de Uso,
                por favor, contáctenos a través del correo electrónico 
                <strong>
                  <em> nutrichatbotuv@gmail.com</em>
                </strong>
                .
              </p>
            </Row>
          </div>
        </Row>
      </Container>
    </div>
  );
}

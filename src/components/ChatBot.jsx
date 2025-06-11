import React, { useState, useEffect, useRef } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export function ChatBot() {
  const [userEmail, setUserEmail] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hola, bienvenido a NutriChat, ¿me podrias dar tu nombre?",
      sender: "ChatGPT",
    },
  ]);

  const sendEmail = async (userEmail, chatContent) => {
    try {
      const response = await fetch('/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: userEmail,
          subject: 'Tu Plan Nutricional con NutriChat',
          html: generateEmailHTML(chatContent),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setError({ type: 'success', message: 'Correo electrónico enviado con éxito' });
      } else {
        setError({ type: 'danger', message: 'Error al enviar el correo electrónico' });
      }
    } catch (error) {
      setError({ type: 'danger', message: 'Error al enviar el correo electrónico' });
      console.error('Error al enviar el correo electrónico', error);
    }
  };

  const generateEmailHTML = (chatContent) => {
    // Construir el HTML del correo electrónico usando el contenido del chat
    const chatHTML = chatContent.map((message) => {
      const sender = message.sender === 'user' ? 'Usuario' : 'NutriChat';
      return `<p><strong>${sender}:</strong> ${message.message}</p>`;
    }).join('');

    return `
      <html>
        <head></head>
        <body>
          <p><strong>Detalles del chat:</strong></p>
          ${chatHTML}
        </body>
      </html>
    `;
  };

  const chatRef = useRef(); // Agrega esta línea para referenciar el contenedor del chat

  const generatePDF = async () => {
    if (!chatRef.current) {
      setError({ type: 'danger', message: 'Error al generar el PDF: No se encontró el contenido del chat' });
      return;
    }

    setIsGeneratingPDF(true);
    setError(null);

    try {
      const originalHeight = chatRef.current.style.height;
      const originalOverflow = chatRef.current.style.overflow;

      chatRef.current.style.height = "auto";
      chatRef.current.style.overflow = "visible";

      const canvas = await html2canvas(chatRef.current, { scrollY: -window.scrollY });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();

      const imgWidth = 190;
      const pageHeight = 290;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("chat.pdf");
      
      if (userEmail) {
        await sendEmail(userEmail, messages);
      } else {
        setError({ type: 'warning', message: 'No se encontró un correo electrónico para enviar el PDF' });
      }
    } catch (error) {
      setError({ type: 'danger', message: 'Error al generar el PDF' });
      console.error('Error al generar PDF:', error);
    } finally {
      if (chatRef.current) {
        chatRef.current.style.height = originalHeight;
        chatRef.current.style.overflow = originalOverflow;
      }
      setIsGeneratingPDF(false);
    }
  };

  useEffect(() => {
    // Mostrar el modal al cargar la página
    handleShow();
  }, []);

  const handleSend = async (message) => {
    if (!message.trim()) {
      setError({ type: 'warning', message: 'Por favor, escribe un mensaje' });
      return;
    }

    setError(null);
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setTyping(true);

    try {
      await processMessageToChatGPT(newMessages);

      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
      const matches = message.match(emailRegex);

      if (matches && matches.length > 0) {
        setUserEmail(matches[0]);
      }
    } catch (error) {
      setError({ type: 'danger', message: 'Error al procesar el mensaje' });
      console.error('Error en handleSend:', error);
    } finally {
      setTyping(false);
    }
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role: role, content: messageObject.message };
    });

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setMessages([...chatMessages, {
          message: data.message,
          sender: "ChatGPT"
        }]);
      } else {
        throw new Error(data.error || 'Error en la respuesta del servidor');
      }
    } catch (error) {
      setError({ type: 'danger', message: 'Error al comunicarse con el servidor' });
      console.error('Error en processMessageToChatGPT:', error);
      throw error;
    }
  }

  return (
    <>
      {error && (
        <Alert 
          variant={error.type} 
          className="m-3"
          onClose={() => setError(null)} 
          dismissible
        >
          {error.message}
        </Alert>
      )}

      <div
        style={{
          position: "relative",
          margin: "0 auto",
          height: "600px",
          width: "100%",
          overflowX: "hidden",
        }}
        ref={chatRef}
      >
        <MainContainer
          style={{
            borderRadius: "0",
            border: "none",
          }}
        >
          <ChatContainer>
            <MessageList
              typingIndicator={
                typing ? (
                  <TypingIndicator content="NutriChat está escribiendo" />
                ) : null
              }
            >
              {messages.map((message, i) => (
                <Message 
                  scrollBehavior="smooth" 
                  key={i} 
                  model={message}
                  style={{
                    padding: "1rem",
                  }}
                />
              ))}
            </MessageList>
            <MessageInput
              placeholder="Escribe tu mensaje aquí..."
              onSend={handleSend}
              style={{
                borderTop: "1px solid #e9ecef",
                padding: "1rem",
              }}
            />
          </ChatContainer>
        </MainContainer>
      </div>

      <div className="text-center p-3">
        <Button
          variant="outline-primary"
          size="lg"
          onClick={generatePDF}
          className="rounded-pill px-4"
          disabled={isGeneratingPDF}
        >
          {isGeneratingPDF ? 'Generando PDF...' : 'Descargar Chat como PDF'}
        </Button>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        animation={false}
        backdrop="static"
        centered
      >
        <Modal.Header className="bg-light">
          <Modal.Title className="fw-bold">
            Condiciones de Uso del Chatbot de Nutrición
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            textAlign: "justify",
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          Bienvenido/a al Chatbot de Nutrición. Antes de utilizar nuestros
          servicios, te pedimos que leas detenidamente las siguientes
          condiciones.
          <br />
          Al acceder y utilizar este chatbot, aceptas cumplir con los términos
          establecidos a continuación:
          <br />
          <b>Propósito Informativo:</b> El chatbot de nutrición proporciona
          información general sobre temas relacionados con la nutrición y el
          bienestar. La información proporcionada no sustituye el consejo
          profesional individualizado y está destinada únicamente con fines
          informativos.
          <br />
          <b>Variedad de Usuarios:</b> Reconocemos que cada persona es única, y
          la información proporcionada por el chatbot puede no ser aplicable a
          todas las situaciones o a cada individuo. La orientación ofrecida se
          basa en datos generales y no tiene en cuenta circunstancias personales
          específicas.
          <br />
          <b>Consulta Profesional:</b> Se recomienda encarecidamente que
          consultes con un profesional de la salud, como un nutricionista o
          médico, antes de realizar cambios significativos en tu dieta o estilo
          de vida. El chatbot no puede reemplazar la evaluación personalizada de
          un profesional de la salud.
          <br />
          <b>Limitaciones Tecnológicas:</b> El chatbot utiliza inteligencia
          artificial para proporcionar respuestas, y aunque se esfuerza por
          ofrecer información precisa y actualizada, puede haber limitaciones en
          su capacidad para comprender situaciones complejas o proporcionar
          respuestas específicas en todos los casos.
          <br />
          <b>Confidencialidad:</b> La información proporcionada en el chatbot se
          maneja de manera confidencial, según nuestra política de privacidad.
          Sin embargo, ten en cuenta que la seguridad de la información a través
          de internet no puede garantizarse al 100%.
          <br />
          <b>Responsabilidad del Usuario:</b> El usuario asume la
          responsabilidad de cualquier acción que realice como resultado de la
          información proporcionada por el chatbot. Ni el chatbot ni sus
          creadores serán responsables de cualquier consecuencia derivada de las
          decisiones tomadas basándose en la información proporcionada.
          <br />
          Al utilizar este chatbot, aceptas estas condiciones de uso. Si no
          estás de acuerdo con alguna parte de estas condiciones, te
          recomendamos que no utilices el servicio. Estas condiciones pueden
          actualizarse ocasionalmente, y te recomendamos que las revises
          periódicamente. ¡Gracias por utilizar nuestro Chatbot de Nutrición!
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="primary" onClick={handleClose} className="rounded-pill px-4">
            Entendido
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

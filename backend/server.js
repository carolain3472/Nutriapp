// backend/server.js
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const port = 3001; // Puedes cambiar el puerto según tus necesidades

app.use(express.json());


// Configurar el transporter con tus credenciales SMTP
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "lisethcastillo.0325@gmail.com",
    pass: "rkud kmoz ztes oqpj",
  },
});


app.post('/send-email', async (req, res) => {
  const { to, subject, html } = req.body;

  try {

    let mailOptions = {
      from: 'NutriChat <isethcastillo.0325@gmail.com>', // Tu dirección de correo electrónico
      to: to, 
      subject: subject,
      html: html
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          console.log(error);
      } else {
          console.log('Correo electrónico enviado: ' + info.response);
      }
    });

    console.log('Correo electrónico enviado con éxito a ' + to);
    res.status(200).json({ success: true, message: 'Correo electrónico enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar el correo electrónico', error);
    res.status(403).json({ success: false, message: 'Error al enviar el correo electrónico' });
  }
});

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});

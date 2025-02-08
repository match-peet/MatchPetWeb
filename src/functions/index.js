const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');

// Configura tu clave API de SendGrid
sgMail.setApiKey('B1XTFSU8ETWFBURYNZGYDA9C');

exports.sendAdoptionEmail = functions.https.onRequest(async (req, res) => {
    const { userEmail, userName, animalName, animalImage } = req.body;

    const msg = {
        to: userEmail, // El correo del usuario
        from: 'matchpet9@gmail.com', // Tu correo verificado en SendGrid
        subject: 'Detalles de la Solicitud de Adopción',
        html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>🐾 Detalles de la Solicitud de Adopción:</h2>
        <p><strong>Cliente:</strong> ${userName}</p>
        <p><strong>Mascota:</strong> ${animalName}</p>
        <img src="${animalImage}" alt="Foto de la Mascota" width="300"/>
        <p>Gracias por tu interés en la adopción. ¡Te esperamos pronto!</p>
      </div>
    `,
    };

    try {
        await sgMail.send(msg);
        res.status(200).send('Correo enviado exitosamente');
    } catch (error) {
        console.error('Error al enviar el correo', error);
        res.status(500).send('Error al enviar el correo');
    }
});

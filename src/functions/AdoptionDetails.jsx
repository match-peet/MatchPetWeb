import React, { useState } from 'react';

const AdoptionDetails = ({ solicitud, animalData }) => {
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState('');

    const handleSubmit = async () => {
        setIsSending(true);
        setStatus('');

        const emailData = {
            userEmail: solicitud.userEmail,
            userName: solicitud.userName,
            animalName: solicitud.animalName,
            animalImage: animalData.animalImages,
        };

        try {
            const response = await fetch('https://us-central1-B1XTFSU8ETWFBURYNZGYDA9C.cloudfunctions.net/sendAdoptionEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData),
            });

            if (response.ok) {
                setStatus('Correo enviado exitosamente');
            } else {
                setStatus('Error al enviar el correo');
            }
        } catch (error) {
            console.error(error);
            setStatus('Error al enviar el correo');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div>
            {/* Tu código de la UI aquí */}
            <button onClick={handleSubmit} disabled={isSending}>
                {isSending ? 'Enviando...' : 'Enviar Correo'}
            </button>
            {status && <p>{status}</p>}
        </div>
    );
};

export default AdoptionDetails;

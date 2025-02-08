import React from 'react';

const AdoptionDetails = ({ solicitud, animalData }) => {
    return (
        <div style={styles.container}>
            <h2 style={styles.header}>🐾 Detalles de la Solicitud de Adopción:</h2>
            <p>📅 <strong style={styles.highlight}>Día:</strong> Lunes</p>
            <p>⏰ <strong style={styles.highlight}>Hora:</strong> 10:00 AM</p>
            <p>📍 <strong style={styles.highlight}>Lugar:</strong> Centro de Adopción Happy Tail</p>
            <p>
                ✨ ¡Te esperamos con mucha ilusión para conocer a tu futura mascota! Por favor, llega puntual y trae contigo una copia de tu identificación y cualquier otro documento relevante para completar el proceso de adopción.
            </p>

            <h3>Mascota Adoptada:</h3>
            <ul>
                <li><strong style={styles.highlight}>Animal:</strong> {solicitud.animalName}</li>
                <li><strong style={styles.highlight}>Raza:</strong> {animalData?.raza ?? 'No definida'}</li>
                <li><strong style={styles.highlight}>Edad:</strong> {animalData?.edad ?? 'No definida'}</li>
                <li><strong style={styles.highlight}>Sexo:</strong> {animalData?.sexo ?? 'No definido'}</li>
                <li><strong style={styles.highlight}>Tiempo en Fundación:</strong> {animalData?.tiempo_en_fundacion ?? 'No definido'}</li>
                <li><strong style={styles.highlight}>Estado:</strong> {solicitud.status}</li>
            </ul>

            <h3>Imagen de la Mascota:</h3>
            <p>
                <img src={animalData?.animalImages} alt="Foto de la Mascota" style={styles.image} />
            </p>

            <h3>Detalles del Usuario:</h3>
            <ul>
                <li><strong style={styles.highlight}>Cliente:</strong> {solicitud.userName ?? 'No definido'}</li>
                <li><strong style={styles.highlight}>Edad Usuario:</strong> {solicitud.userAge ?? 'No definida'}</li>
                <li><strong style={styles.highlight}>Teléfono:</strong> {solicitud.userPhone ?? 'No definido'}</li>
                <li><strong style={styles.highlight}>Fecha de Adopción:</strong> {solicitud.fechaAdopcion ?? 'No definida'}</li>
                <li><strong style={styles.highlight}>Hora de Adopción:</strong> {solicitud.horaAdopcion ?? 'No definida'}</li>
            </ul>

            <h3>Detalles de la Adopción:</h3>
            <ul>
                <li><strong style={styles.highlight}>Compromiso Económico:</strong> {solicitud.compromisoEconomico ?? 'No definido'}</li>
                <li><strong style={styles.highlight}>Disponibilidad de Seguimiento:</strong> {solicitud.disponibilidadSeguimiento ?? 'No definida'}</li>
                <li><strong style={styles.highlight}>Aceptación Contrato:</strong> {solicitud.aceptacionContrato ?? 'No definido'}</li>
                <li><strong style={styles.highlight}>Situación Vivienda:</strong> {solicitud.situacionVivienda ?? 'No definida'}</li>
                <li><strong style={styles.highlight}>Tiempo Fuera de Casa:</strong> {solicitud.tiempoFuera ?? 'No definido'}</li>
                <li><strong style={styles.highlight}>Deportes:</strong> {solicitud.sports ?? 'No definido'}</li>
                <li><strong style={styles.highlight}>Anterior Mascota:</strong> {solicitud.tipoMascota ?? 'No definida'}</li>
            </ul>

            <p style={styles.note}>
                💌 <strong>Nota:</strong> Si no puedes asistir a esta cita, contáctanos con antelación para reprogramar. ¡Queremos asegurarnos de que todo sea perfecto para ti y para la mascota! 🐶❤️
            </p>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#f4f4f4',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        color: '#333',
        paddingTop: '20px',
    },
    header: {
        color: '#4CAF50',
    },
    highlight: {
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    image: {
        maxWidth: '100%',
        borderRadius: '10px',
        marginTop: '10px',
    },
    note: {
        marginTop: '20px',
        fontStyle: 'italic',
        color: '#777',
    },
};

export default AdoptionDetails;

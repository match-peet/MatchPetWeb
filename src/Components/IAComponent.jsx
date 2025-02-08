import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import { database, ref, get } from '../Data/firebaseConfig';
import { Card, CardContent, CardMedia, Typography, Button, Container } from '@mui/material';

const MODEL_URL = 'https://match-peet.github.io/MatchPetWeb/tfjs_model/model.json';
const userId = 'KVP06LyALVUwGH5HlKOoiUWbl722';

const TensorflowPredictor = () => {
    const [model, setModel] = useState(null);
    const [userPreferences, setUserPreferences] = useState(null);
    const [animals, setAnimals] = useState([]);
    const [bestMatch, setBestMatch] = useState(null);

    useEffect(() => {
        loadModel();
        fetchUserPreferences();
        fetchAnimals();
    }, []);

    // Cargar el modelo
    const loadModel = async () => {
        try {
            console.log('🔄 Cargando modelo...');
            const loadedModel = await tf.loadLayersModel(MODEL_URL);
            console.log('✅ Modelo cargado:', loadedModel);
            setModel(loadedModel);
        } catch (error) {
            console.error("❌ Error cargando el modelo:", error);
        }
    };

    // Obtener preferencias del usuario desde Firebase
    const fetchUserPreferences = async () => {
        try {
            const snapshot = await get(ref(database, `User/${userId}`));
            if (snapshot.exists()) {
                setUserPreferences(snapshot.val());
                console.log("🎯 Preferencias del usuario obtenidas:", snapshot.val());
            } else {
                console.warn("⚠ No se encontraron datos para el usuario.");
            }
        } catch (error) {
            console.error("❌ Error obteniendo preferencias del usuario:", error);
        }
    };

    // Obtener datos de todos los animales desde Firebase
    const fetchAnimals = async () => {
        try {
            const snapshot = await get(ref(database, 'Animal/'));
            if (snapshot.exists()) {
                const animalsData = Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data }));
                setAnimals(animalsData);
                console.log("🐶 Datos de animales obtenidos:", animalsData);
            } else {
                console.warn("⚠ No se encontraron datos de animales.");
            }
        } catch (error) {
            console.error("❌ Error obteniendo datos de animales:", error);
        }
    };

    // Preprocesar las preferencias del usuario
    const preprocessUserPreferences = () => {
        if (!userPreferences) return [];

        const prefs = userPreferences.preferences;

        return [
            prefs["aceptacionContrato"][0] === 'Sí' ? 1 : 0,
            prefs["compromisoEconomico"][0] === 'Sí' ? 1 : 0,
            prefs["disponibilidadSeguimiento"][0] === 'Sí' ? 1 : 0,
            prefs["espacioExterior"][0] === 'Sí' ? 1 : 0,
            prefs["experienciaMascota"][0] === 'Sí' ? 1 : 0,
            encodeCategory(prefs["foods"][0]),
            encodeCategory(prefs["hobbies"][0]),
            encodeCategory(prefs["moods"][0]),
            encodeCategory(prefs["motivacion"][0]),
            encodeCategory(prefs["preferenciaRaza"][0]),
            encodeCategory(prefs["selectedLifestyles"][0]),
            encodeCategory(prefs["situacionVivienda"][0]),
            encodeCategory(prefs["sports"][0]),
            encodeCategory(prefs["tiempoFuera"][0]),
            encodeCategory(prefs["tipoMascota"][0]),
            encodeCategory(prefs["ultimaMascota"][0])
        ];
    };

    // Función de codificación para variables categóricas
    const encodeCategory = (value) => {
        const categories = ['Sí', 'No']; // Asumimos que las categorías son 'Sí' y 'No', cambia si es necesario
        return categories.indexOf(value);
    };

    // Función para realizar predicciones y encontrar la mejor coincidencia
    const handlePredict = async () => {
        if (!model || !userPreferences || animals.length === 0) {
            alert("Datos insuficientes para realizar la predicción");
            return;
        }

        let bestAnimal = null;
        let bestScore = -Infinity;

        const userPrefs = preprocessUserPreferences();
        if (userPrefs.length !== 16) {
            console.error("❌ El número de preferencias del usuario no es 16. Revisar datos.");
            return;
        }

        for (const animal of animals) {
            try {
                // Preprocesar los datos del animal
                const animalTensor = tf.tensor2d([Object.values(animal.traits)], [1, 5]); // Asegúrate que cada animal tenga 5 características
                const userTensor = tf.tensor2d([userPrefs], [1, 16]);  // 16 características del usuario

                // Realizar predicción
                const output = model.predict([userTensor, animalTensor]);
                const score = await output.data(); // Convertir a array

                console.log(`📊 Similitud con ${animal.name}:`, score[0]);

                // Comparar para encontrar el mejor match
                if (score[0] > bestScore) {
                    bestScore = score[0];
                    bestAnimal = animal;
                }

                // Liberar memoria
                userTensor.dispose();
                animalTensor.dispose();
                output.dispose();
            } catch (error) {
                console.error(`❌ Error en predicción con ${animal.name}:`, error);
            }
        }

        setBestMatch(bestAnimal);
        console.log("🏆 Mejor coincidencia:", bestAnimal);
    };

    return (
        <Container>
            <h2>🔍 Encuentra tu mascota ideal</h2>
            <Button variant="contained" color="primary" onClick={handlePredict} disabled={!model}>
                Encontrar coincidencia
            </Button>

            {bestMatch && (
                <Card sx={{ maxWidth: 400, marginTop: 3 }}>
                    <CardMedia component="img" height="200" image={bestMatch.image || 'default.jpg'} alt={bestMatch.name} />
                    <CardContent>
                        <Typography variant="h5">{bestMatch.name}</Typography>
                        <Typography variant="body2">Raza: {bestMatch.breed}</Typography>
                        <Typography variant="body2">Edad: {bestMatch.age} años</Typography>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};

export default TensorflowPredictor;

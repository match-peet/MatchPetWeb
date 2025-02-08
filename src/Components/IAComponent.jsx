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

            console.log("✅ Modelo original cargado. Reconstruyendo...");

            // Obtener las capas intermedias y de salida
            const layers = loadedModel.layers.slice(2);  // Omitimos las capas de entrada

            // Crear nuevas entradas con inputShape en lugar de batch_shape
            const newInput1 = tf.input({ shape: [1165, 1], name: "input_layer_2" });
            const newInput2 = tf.input({ shape: [771, 1], name: "input_layer_3" });

            // Pasar las nuevas entradas a la red
            let x1 = newInput1;
            let x2 = newInput2;

            for (let layer of layers) {
                if (layer.inputShape[1] === 1165) {
                    x1 = layer.apply(x1);
                } else if (layer.inputShape[1] === 771) {
                    x2 = layer.apply(x2);
                }
            }

            // Combinar las salidas de ambas ramas antes de la capa final
            const outputLayer = layers[layers.length - 1].apply([x1, x2]);

            // Reconstruir el modelo con las nuevas entradas
            const newModel = tf.model({ inputs: [newInput1, newInput2], outputs: outputLayer });

            console.log('✅ Modelo reconstruido con éxito:', newModel);
            setModel(newModel);
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

        // Se ajusta para que coincida con input_layer_2
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
        const categories = ['Sí', 'No'];
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
        if (userPrefs.length !== 1165) {
            console.error("❌ La cantidad de datos del usuario no coincide con el modelo (1165).");
            return;
        }

        for (const animal of animals) {
            try {
                // Verificar que los datos del animal sean correctos
                if (!animal.traits || Object.values(animal.traits).length !== 771) {
                    console.warn(`⚠ Datos incorrectos para ${animal.name}, se omite.`);
                    continue;
                }

                // Crear tensores con las dimensiones adecuadas
                const animalTensor = tf.tensor3d([Object.values(animal.traits)], [1, 771, 1]);
                const userTensor = tf.tensor3d([userPrefs], [1, 1165, 1]);

                // Realizar predicción
                const output = model.predict([userTensor, animalTensor]);
                const score = (await output.data())[0];

                console.log(`📊 Similitud con ${animal.name}:`, score);

                // Comparar para encontrar el mejor match
                if (score > bestScore) {
                    bestScore = score;
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

// Frontend/react-app/src/components/ListaCandidatos.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define la URL base de tu API
const API_BASE_URL = 'http://localhost:8000/api'; 

function ListaCandidatos() {
    const [candidatos, setCandidatos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        // Petición GET a http://localhost:8000/api/candidatos
        axios.get(`${API_BASE_URL}/candidatos`)
            .then(response => {
                setCandidatos(response.data);
                setCargando(false);
            })
            .catch(error => {
                console.error("Hubo un error al obtener los candidatos:", error);
                setCargando(false);
                // Aquí podrías mostrar un mensaje de error al usuario
            });
    }, []);

    if (cargando) return <p>Cargando candidatos...</p>;

    return (
        <div>
            <h2>Candidatos (Endpoint: /api/candidatos)</h2>
            <ul>
                {candidatos.map(candidato => (
                    <li key={candidato.id}>{candidato.nombre} - Lista: {candidato.lista_id}</li>
                ))}
            </ul>
        </div>
    );
}

export default ListaCandidatos;
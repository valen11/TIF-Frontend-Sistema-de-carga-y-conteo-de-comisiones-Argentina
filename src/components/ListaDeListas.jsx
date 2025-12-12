// Frontend/react-app/src/components/ListaDeListas.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// La URL base de tu API de Laravel (Asegúrate de que este puerto sea el correcto,
// normalmente 8000 si usas 'php artisan serve')
const API_BASE_URL = 'http://localhost:8000/api'; 

function ListaDeListas() {
    // Estado para guardar el array de listas
    const [listas, setListas] = useState([]);
    // Estado para saber si la información está cargando
    const [cargando, setCargando] = useState(true);
    // Estado para manejar errores de la API
    const [error, setError] = useState(null);

    useEffect(() => {
        // La función que realiza la llamada a la API
        const obtenerListas = async () => {
            try {
                // Llama al endpoint GET /api/listas
                const response = await axios.get(`${API_BASE_URL}/listas`);
                
                // Los datos de las listas están en response.data.listas
                setListas(response.data.listas); 
                setCargando(false);
            } catch (err) {
                console.error("Error al obtener las listas:", err);
                setError("No se pudieron cargar las listas. Verifica que el servidor de Laravel esté corriendo.");
                setCargando(false);
            }
        };

        obtenerListas();
    }, []); // El array vacío asegura que se ejecute solo una vez al montar

    if (cargando) {
        return <p>Cargando información de listas...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>Error: {error}</p>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Listado de Partidos y Alianzas ({listas.length} encontrados)</h1>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {listas.map(lista => (
                    <li 
                        key={lista.idLista} 
                        style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px', borderRadius: '5px' }}
                    >
                        
                        <h3>{lista.nombre}</h3>
                        <p><strong>Alianza:</strong> {lista.alianza}</p>
                        <p>
                            <strong>Provincia:</strong> {lista.provincia.nombre} ({lista.provincia.codigo})
                        </p>
                        <p>
                            <strong>Cargos:</strong> {lista.cargoDiputado} y {lista.cargoSenador}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListaDeListas;
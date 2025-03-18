import React, { useEffect, useState } from 'react';
import instance from '../../api/axios'; // Ajusta la ruta según la ubicación de tu archivo axios.js

function DispositivosList() {
    const [dispositivos, setDispositivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDispositivos = async () => {
          try {
            const response = await instance.get('/dispositivos'); // Usa la ruta correcta
            console.log("Respuesta de la API:", response.data); // Verifica la estructura de la respuesta
            setDispositivos(response.data);
            setLoading(false);
          } catch (error) {
            console.error("Error al obtener dispositivos:", error);
            setError(error.message);
            setLoading(false);
          }
        };
      
        fetchDispositivos();
      }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando dispositivos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>Error: {error}</p>
                <button className="retry-btn" onClick={() => window.location.reload()}>Reintentar</button>
            </div>
        );
    }

    if (!Array.isArray(dispositivos) || dispositivos.length === 0) {
        return (
            <div className="empty-state">
                <p>No se encontraron dispositivos.</p>
            </div>
        );
    }

    return (
        <div className="table-container">
            <div className="table-header">
                <h1 className="table-title">Lista de Dispositivos</h1>
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar dispositivo..."
                    />
                    <span className="search-icon">&#128269;</span> {/* Icono de búsqueda */}
                </div>
      
            </div>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nombre del Dispositivo</th>
                            <th>Dirección MAC</th>
                            <th>Usuario</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dispositivos.map((dispositivo) => (
                            <tr key={dispositivo._id}>
                                <td data-label="Nombre del Dispositivo">{dispositivo.name}</td>
                                <td data-label="Dirección MAC">{dispositivo.macAddress}</td>
                                <td data-label="Usuario">{dispositivo.user ? dispositivo.user.realName : 'Sin usuario'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DispositivosList;


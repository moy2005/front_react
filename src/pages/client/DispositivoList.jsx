import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DispositivoList = () => {
    const [dispositivos, setDispositivos] = useState([]);

    useEffect(() => {
        const fetchDispositivos = async () => {
            try {
                const response = await axios.get('/api/dispositivos');
                setDispositivos(response.data);
            } catch (error) {
                console.error('Error fetching dispositivos:', error);
            }
        };

        fetchDispositivos();
    }, []);

    return (
        <div>
            <h1>Mis Dispositivos</h1>
            <ul>
                {dispositivos.map((dispositivo) => (
                    <li key={dispositivo._id}>
                        <Link to={`/dispositivo/${dispositivo.macAddress}`}>
                            {dispositivo.name} - {dispositivo.macAddress}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DispositivoList;


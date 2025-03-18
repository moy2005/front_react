import React from 'react';
import { useParams } from 'react-router-dom';
import { useMqtt } from '../hooks/useMqtt';

const DispositivoDetail = () => {
    const { macAddress } = useParams();
    const { datos, conectado, controlarRiego, controlarVentilador, loading } = useMqtt(macAddress);

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <h1>Detalles del Dispositivo: {macAddress}</h1>
            {conectado ? (
                <div>
                    <p>Temperatura: {datos?.temperatura}°C</p>
                    <p>Humedad: {datos?.humedad}%</p>
                    <p>Humedad del Suelo: {datos?.humedadSuelo}%</p>
                    <p>Riego: {datos?.riego ? 'Encendido' : 'Apagado'}</p>
                    <p>Ventilador: {datos?.ventilador ? 'Encendido' : 'Apagado'}</p>

                    <button onClick={() => controlarRiego(macAddress, !datos?.riego)}>
                        {datos?.riego ? 'Apagar Riego' : 'Encender Riego'}
                    </button>
                    <button onClick={() => controlarVentilador(macAddress, !datos?.ventilador)}>
                        {datos?.ventilador ? 'Apagar Ventilador' : 'Encender Ventilador'}
                    </button>
                </div>
            ) : (
                <div>No se pudo conectar al dispositivo.</div>
            )}
        </div>
    );
};

export default DispositivoDetail;


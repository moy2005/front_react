import { useState, useEffect, useRef } from 'react';
import MQTT from 'mqtt';
import instance from '../api/axios';

export const useMqtt = (macAddress) => {
    const [datos, setDatos] = useState({
        temperatura: undefined,
        humedad: undefined,
        humedadSuelo: undefined,
        luz: undefined,
        ventanaAbierta: false,
        ventiladorActivo: false,
        ventiladorVelocidad: 0,
        riegoActivo: false
    });
    const [conectado, setConectado] = useState(false);
    const [loading, setLoading] = useState(true);
    const clientRef = useRef(null);
    const lastMessageTimeRef = useRef(null);

    const guardarEstadoEnBD = async (payload) => {
        try {
            const response = await instance.post('/estado-dispositivo', {
                macAddress,
                ...payload
            });
            console.log("Estado guardado en la base de datos:", response.data);
        } catch (error) {
            console.error("Error al guardar el estado en la base de datos:", error);
        }
    };

    useEffect(() => {
        if (!macAddress) {
            console.error("MAC Address no proporcionada");
            setLoading(false);
            return;
        }

        const mqttOptions = {
            clientId: `sensor-reader-${macAddress}-${Math.random().toString(16).substring(2, 8)}`,
            username: "moy19",
            password: "moy19",
            clean: true,
            reconnectPeriod: 1000,
            connectTimeout: 30 * 1000,
            // Añade estas opciones para conexiones seguras:
            rejectUnauthorized: false, // Solo para desarrollo (no usar en producción)
            protocol: 'wss', // Fuerza el protocolo seguro
            wsOptions: {
              // Opciones adicionales para WebSocket
            }
          };

        const brokerUrl = "wss://raba7554.ala.dedicated.aws.emqxcloud.com:8084/mqtt";
        clientRef.current = MQTT.connect(brokerUrl, mqttOptions);

        clientRef.current.on('connect', () => {
            console.log("Conectado al broker MQTT para lectura de sensores");
            const sensorTopic = `mi/topico/sensor/${macAddress}`;
            clientRef.current.subscribe(sensorTopic, (err) => {
                if (!err) {
                    console.log(`Suscrito a: ${sensorTopic}`);
                    setConectado(true);
                } else {
                    console.error("Error al suscribirse:", err);
                    setConectado(false);
                }
            });
        });

        clientRef.current.on('message', (topic, message) => {
            if (topic === `mi/topico/sensor/${macAddress}`) {
                try {
                    const payload = JSON.parse(message.toString());
                    console.log("Datos del sensor recibidos:", payload);

                    setDatos({
                        temperatura: payload.temperatura,
                        humedad: payload.humedad,
                        humedadSuelo: payload.humedadSuelo,
                        luz: payload.luz,
                        ventanaAbierta: payload.ventanaAbierta === "true" || payload.ventanaAbierta === true,
                        ventiladorActivo: payload.ventiladorActivo === "true" || payload.ventiladorActivo === true,
                        ventiladorVelocidad: payload.ventiladorVelocidad,
                        riegoActivo: payload.riegoActivo === "true" || payload.riegoActivo === true
                    });

                    guardarEstadoEnBD(payload); // Guardar el estado en la base de datos

                    lastMessageTimeRef.current = Date.now();
                    setConectado(true);
                } catch (error) {
                    console.error("Error al procesar mensaje:", error);
                }
            }
        });

        const intervalo = setInterval(() => {
            if (lastMessageTimeRef.current && Date.now() - lastMessageTimeRef.current > 15000) {
                console.log("No se han recibido mensajes en el tiempo esperado");
                setConectado(false);
            }
        }, 5000);

        clientRef.current.on('error', (err) => {
            console.error("Error en conexión MQTT:", err);
            setConectado(false);
            
            // Intenta reconectar con parámetros alternativos después de un retraso
            setTimeout(() => {
              if (clientRef.current) {
                clientRef.current.end(); // Cierra la conexión existente
              }
              console.log("Intentando reconexión...");
              clientRef.current = MQTT.connect(brokerUrl, mqttOptions);
            }, 5000);
          });

        setLoading(false);

        return () => {
            clearInterval(intervalo);
            if (clientRef.current) {
                clientRef.current.end();
                console.log("Cliente MQTT desconectado");
            }
        };
    }, [macAddress]);

    return { datos, conectado, loading };
};


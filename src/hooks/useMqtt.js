import { useState, useEffect, useRef } from 'react';
import MQTT from 'mqtt';

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

    useEffect(() => {
        if (!macAddress) {
            console.error("MAC Address no proporcionada");
            setLoading(false);
            return;
        }

        // Configuración de cliente MQTT - SOLO PARA LECTURA DE DATOS
        const mqttOptions = {
            clientId: `sensor-reader-${macAddress}-${Math.random().toString(16).substring(2, 8)}`,
            username: "moy19",
            password: "moy19",
            clean: true,
            reconnectPeriod: 1000,
            connectTimeout: 30 * 1000
        };

        // Para navegadores, usar WebSocket en lugar de TCP
        const brokerUrl = "ws://raba7554.ala.dedicated.aws.emqxcloud.com:8083/mqtt";
        clientRef.current = MQTT.connect(brokerUrl, mqttOptions);

        clientRef.current.on('connect', () => {
            console.log("Conectado al broker MQTT para lectura de sensores");
            
            // Solo suscribirse al tema del sensor para datos
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
                    
                    // Actualizar todos los datos disponibles del mensaje
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
                    
                    // Actualizar tiempo del último mensaje
                    lastMessageTimeRef.current = Date.now();
                    setConectado(true);
                } catch (error) {
                    console.error("Error al procesar mensaje:", error);
                }
            }
        });

        // Verificar desconexión por timeout
        const intervalo = setInterval(() => {
            if (lastMessageTimeRef.current && Date.now() - lastMessageTimeRef.current > 15000) {
                console.log("No se han recibido mensajes en el tiempo esperado");
                setConectado(false);
            }
        }, 5000);

        clientRef.current.on('error', (err) => {
            console.error("Error en conexión MQTT:", err);
            setConectado(false);
        });

        setLoading(false);

        // Limpieza
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
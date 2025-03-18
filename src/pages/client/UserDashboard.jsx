import React, { useEffect, useRef, useState } from "react";
import { useParams } from 'react-router-dom';
import {useMqtt} from '../../hooks/useMqtt'; 
import MQTT from "mqtt";

const UserDashboard = () => {
    const { macAddress } = useParams();
    const client = useRef(null);
    const [mqttConnected, setMqttConnected] = useState(false);
    const [lastCommands, setLastCommands] = useState({
        servo: null,
        riego: null,
        ventilador: null,
        velocidad: null
    });

    useEffect(() => {
        // Configuración completa de MQTT con autenticación
        const mqttOptions = {
            clientId: `frontend-${macAddress}-${Math.random().toString(16).substring(2, 8)}`,
            username: "moy19",
            password: "moy19",
            clean: true,
            reconnectPeriod: 1000,
            connectTimeout: 30 * 1000
        };

        console.log("Conectando a MQTT con opciones:", mqttOptions);
        
        // Intentar usar conexión websocket ya que puede funcionar mejor en navegadores
        const url = "ws://raba7554.ala.dedicated.aws.emqxcloud.com:8083/mqtt";
        client.current = MQTT.connect(url, mqttOptions);

        client.current.on('connect', () => {
            console.log("✅ Conexión MQTT establecida correctamente");
            setMqttConnected(true);
            
            // Suscribirse a todos los temas relevantes
            const topics = [
                `mi/topico/servo/${macAddress}`,
                `mi/topico/riego/${macAddress}`,
                `mi/topico/ventilador/${macAddress}`,
                `mi/topico/ventilador/speed/${macAddress}`
            ];
            
            topics.forEach(topic => {
                client.current.subscribe(topic, (err) => {
                    if (!err) {
                        console.log(`✅ Suscrito al tema: ${topic}`);
                    } else {
                        console.error("❌ Error al suscribirse:", err);
                    }
                });
            });
        });

        client.current.on('error', (err) => {
            console.error("❌ Error en la conexión MQTT:", err);
            setMqttConnected(false);
        });

        client.current.on('message', (topic, message) => {
            console.log(`📨 Mensaje recibido en tema ${topic}: ${message.toString()}`);
            
            // Actualizar último comando según el tema
            if (topic.includes('servo')) {
                setLastCommands(prev => ({ ...prev, servo: message.toString() }));
            } else if (topic.includes('riego')) {
                setLastCommands(prev => ({ ...prev, riego: message.toString() }));
            } else if (topic.includes('speed')) {
                setLastCommands(prev => ({ ...prev, velocidad: message.toString() }));
            } else if (topic.includes('ventilador')) {
                setLastCommands(prev => ({ ...prev, ventilador: message.toString() }));
            }
        });

        client.current.on('offline', () => {
            console.log("❌ Cliente MQTT desconectado");
            setMqttConnected(false);
        });

        client.current.on('reconnect', () => {
            console.log("🔄 Intentando reconectar a MQTT...");
        });

        return () => {
            if (client.current) {
                console.log("🛑 Desconectando cliente MQTT");
                client.current.end();
            }
        };
    }, [macAddress]);

    // Función para publicar mensajes MQTT
    const publicarMensaje = (tipo, comando) => {
        if (!client.current || !mqttConnected) {
            console.error("❌ Cliente MQTT no conectado");
            return;
        }

        let topic;
        const comandoStr = String(comando);
        
        switch (tipo) {
            case 'servo':
                topic = `mi/topico/servo/${macAddress}`;
                setLastCommands(prev => ({ ...prev, servo: comandoStr }));
                break;
            case 'riego':
                topic = `mi/topico/riego/${macAddress}`;
                setLastCommands(prev => ({ ...prev, riego: comandoStr }));
                break;
            case 'ventilador':
                topic = `mi/topico/ventilador/${macAddress}`;
                setLastCommands(prev => ({ ...prev, ventilador: comandoStr }));
                break;
            case 'velocidad':
                topic = `mi/topico/ventilador/speed/${macAddress}`;
                setLastCommands(prev => ({ ...prev, velocidad: comandoStr }));
                break;
            default:
                console.error("Tipo de comando no válido");
                return;
        }
        
        console.log(`🔄 Intentando enviar comando '${comandoStr}' al tema ${topic}`);
        
        client.current.publish(topic, comandoStr, { qos: 1, retain: false }, (error) => {
            if (error) {
                console.error(`❌ Error al publicar en ${topic}:`, error);
            } else {
                console.log(`✅ Mensaje enviado a ${topic}: ${comandoStr}`);
            }
        });
    };

    if (!macAddress) {
        return <p>Error: MAC Address no encontrado</p>;
    }

    const { datos, conectado, loading } = useMqtt(macAddress);

    const obtenerEstadoTemperatura = (temperatura) => {
        if (temperatura === undefined) return "Desconocida";
        if (temperatura < 20) return "Baja";
        if (temperatura > 30) return "Alta";
        return "Óptima";
    };

    const obtenerEstadoHumedad = (humedad) => {
        if (humedad === undefined) return "Desconocida";
        if (humedad < 30) return "Baja";
        if (humedad > 70) return "Alta";
        return "Óptima";
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Óptima":
                return "success";
            case "Baja":
            case "Alta":
                return "warning";
            default:
                return "default";
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-row">
                <h2 className="dashboard-title">Dashboard de Dispositivo IoT</h2>

                <div className="full-width">
                    <div className="connection-card">
                        <h3 className="card-header">Estado de Conexión</h3>
                        <div className="card-body">
                            <p>
                                Estado del dispositivo: <span className={`connection-status ${conectado ? "connected" : "disconnected"}`}></span>
                                {conectado ? "Conectado" : "Desconectado"}
                            </p>
                            <p>
                                Estado MQTT: <span className={`connection-status ${mqttConnected ? "connected" : "disconnected"}`}></span>
                                {mqttConnected ? "Conectado" : "Desconectado"}
                            </p>
                            <p>MAC Address: {macAddress}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-row">
                <div className="dashboard-col">
                    <div className={`dashboard-card ${!conectado ? "disabled" : ""}`}>
                        <div className="card-header">
                            <div className="card-title">
                                <span className="card-icon temperature-icon">🌡️</span>
                                <span>Temperatura</span>
                            </div>
                        </div>
                        <div className="card-content">
                            <div className="card-statistic">
                                {datos.temperatura ?? 0}
                                <span className="suffix">°C</span>
                            </div>
                            <div className="progress-container">
                                <div
                                    className={`progress-bar ${getStatusColor(obtenerEstadoTemperatura(datos.temperatura))}`}
                                    style={{
                                        width: `${Math.min(100, Math.max(0, ((datos.temperatura - 10) / 30) * 100))}%`,
                                    }}
                                ></div>
                            </div>
                            <div className="card-status">
                                <span className={`status-badge ${getStatusColor(obtenerEstadoTemperatura(datos.temperatura))}`}>
                                    {obtenerEstadoTemperatura(datos.temperatura)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-col">
                    <div className={`dashboard-card ${!conectado ? "disabled" : ""}`}>
                        <div className="card-header">
                            <div className="card-title">
                                <span className="card-icon humidity-icon">💧</span>
                                <span>Humedad</span>
                            </div>
                        </div>
                        <div className="card-content">
                            <div className="card-statistic">
                                {datos.humedad ?? 0}
                                <span className="suffix">%</span>
                            </div>
                            <div className="progress-container">
                                <div
                                    className={`progress-bar ${getStatusColor(obtenerEstadoHumedad(datos.humedad))}`}
                                    style={{
                                        width: `${Math.min(100, Math.max(0, datos.humedad))}%`,
                                    }}
                                ></div>
                            </div>
                            <div className="card-status">
                                <span className={`status-badge ${getStatusColor(obtenerEstadoHumedad(datos.humedad))}`}>
                                    {obtenerEstadoHumedad(datos.humedad)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-col">
                    <div className={`dashboard-card ${!conectado ? "disabled" : ""}`}>
                        <div className="card-header">
                            <div className="card-title">
                                <span className="card-icon soil-icon">🌱</span>
                                <span>Humedad Suelo</span>
                            </div>
                        </div>
                        <div className="card-content">
                            <div className="card-statistic">
                                {datos.humedadSuelo ?? 0}
                                <span className="suffix">%</span>
                            </div>
                            <div className="progress-container">
                                <div
                                    className="progress-bar"
                                    style={{
                                        width: `${Math.min(100, Math.max(0, datos.humedadSuelo))}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-row">
                <div className="dashboard-col">
                    <div className={`dashboard-card ${!conectado || !mqttConnected ? "disabled" : ""}`}>
                        <div className="card-header">
                            <div className="card-title">
                                <span className="card-icon servo-icon">🪟</span>
                                <span>Control de Ventana</span>
                            </div>
                        </div>
                        <div className="card-content">
                            <div className="card-status-info">
                                Estado: <strong>{datos.ventanaAbierta ? "Abierta" : "Cerrada"}</strong>
                            </div>
                            <div className="button-group">
                                <button
                                    className="action-button"
                                    onClick={() => publicarMensaje('servo', 'abrir')}
                                    disabled={!conectado || !mqttConnected}
                                >
                                    Abrir Ventana
                                </button>
                                <button
                                    className="action-button"
                                    onClick={() => publicarMensaje('servo', 'cerrar')}
                                    disabled={!conectado || !mqttConnected}
                                >
                                    Cerrar Ventana
                                </button>
                            </div>
                            <div className="last-command">
                                Último comando: {lastCommands.servo || "Ninguno"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-col">
                    <div className={`dashboard-card ${!conectado || !mqttConnected ? "disabled" : ""}`}>
                        <div className="card-header">
                            <div className="card-title">
                                <span className="card-icon fan-icon">🌬️</span>
                                <span>Control de Ventilador</span>
                            </div>
                        </div>
                        <div className="card-content">
                            <div className="card-status-info">
                                Estado: <strong>{datos.ventiladorActivo ? "Encendido" : "Apagado"}</strong>
                            </div>
                            <div className="button-group">
                                <button
                                    className="action-button"
                                    onClick={() => publicarMensaje('ventilador', 'encender')}
                                    disabled={!conectado || !mqttConnected}
                                >
                                    Encender
                                </button>
                                <button
                                    className="action-button"
                                    onClick={() => publicarMensaje('ventilador', 'apagar')}
                                    disabled={!conectado || !mqttConnected}
                                >
                                    Apagar
                                </button>
                            </div>
                            <div className="velocity-control">
                                <label>Velocidad: {datos.ventiladorVelocidad || 0}</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="255"
                                    value={datos.ventiladorVelocidad || 0}
                                    onChange={(e) => publicarMensaje('velocidad', e.target.value)}
                                    disabled={!conectado || !mqttConnected}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-col">
                    <div className={`dashboard-card ${!conectado || !mqttConnected ? "disabled" : ""}`}>
                        <div className="card-header">
                            <div className="card-title">
                                <span className="card-icon water-icon">💦</span>
                                <span>Sistema de Riego</span>
                            </div>
                        </div>
                        <div className="card-content">
                            <div className="card-status-info">
                                Estado: <strong>{datos.riegoActivo ? "Activo" : "Inactivo"}</strong>
                            </div>
                            <div className="button-group">
                                <button
                                    className="action-button"
                                    onClick={() => publicarMensaje('riego', 'activar')}
                                    disabled={!conectado || !mqttConnected}
                                >
                                    Activar Riego
                                </button>
                                <button
                                    className="action-button"
                                    onClick={() => publicarMensaje('riego', 'desactivar')}
                                    disabled={!conectado || !mqttConnected}
                                >
                                    Desactivar Riego
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;


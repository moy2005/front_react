import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import instance from "../../api/axios";
import "../../styles/IoT.css";
import MQTT from "mqtt";

const UserDashboard = () => {
  const { macAddress } = useParams();
  const [datosSensores, setDatosSensores] = useState({
    humedad: null,
    humedadSuelo: null,
    temperatura: null,
    ventanaAbierta: null,
    riegoActivo: null,
    ventiladorActivo: null,
    ventiladorVelocidad: null,
  });
  const [ultimoEstado, setUltimoEstado] = useState(null);
  const [mqttConnected, setMqttConnected] = useState(false);
  const [lastCommands, setLastCommands] = useState({
    servo: null,
    riego: null,
    ventilador: null,
    velocidad: null,
  });
  const client = useRef(null);

  // Función para obtener los datos de sensores
  const obtenerDatosSensores = async () => {
    try {
      const response = await instance.get(
        `/estado-dispositivo/${macAddress}/ultimo`
      );
      setUltimoEstado(response.data);
      setDatosSensores({
        humedad: response.data.humedad,
        humedadSuelo: response.data.humedadSuelo,
        temperatura: response.data.temperatura,
        ventanaAbierta: response.data.ventanaAbierta,
        riegoActivo: response.data.riegoActivo,
        ventiladorActivo: response.data.ventiladorActivo,
        ventiladorVelocidad: response.data.ventiladorVelocidad,
      });
    } catch (error) {
      console.error("Error al obtener los datos de los sensores:", error);
    }
  };

  // Usar un intervalo para obtener los datos cada 2 segundos
  useEffect(() => {
    if (!macAddress) return;

    obtenerDatosSensores(); // Inicializa la obtención de datos al montar el componente

    const intervalId = setInterval(() => {
      obtenerDatosSensores(); // Actualiza los datos cada 2 segundos
    }, 2000);

    return () => clearInterval(intervalId);
  }, [macAddress]);

  // Configuración de MQTT
  useEffect(() => {
    if (!macAddress) return;

    const mqttOptions = {
      clientId: `frontend-${macAddress}-${Math.random()
        .toString(16)
        .substring(2, 8)}`,
      username: "moy19",
      password: "moy19",
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      rejectUnauthorized: false,
      protocol: 'wss'
    };

    const url = "wss://raba7554.ala.dedicated.aws.emqxcloud.com:8084/mqtt";
    client.current = MQTT.connect(url, mqttOptions);

    client.current.on("connect", () => {
      console.log("✅ Conexión MQTT establecida correctamente");
      setMqttConnected(true);

      const topics = [
        `mi/topico/servo/${macAddress}`,
        `mi/topico/riego/${macAddress}`,
        `mi/topico/ventilador/${macAddress}`,
        `mi/topico/ventilador/speed/${macAddress}`,
      ];

      topics.forEach((topic) => {
        client.current.subscribe(topic, (err) => {
          if (!err) {
            console.log(`✅ Suscrito al tema: ${topic}`);
          } else {
            console.error("❌ Error al suscribirse:", err);
          }
        });
      });
    });

    client.current.on("error", (err) => {
      console.error("❌ Error en la conexión MQTT:", err);
      setMqttConnected(false);
    });

    client.current.on("message", (topic, message) => {
      console.log(`📨 Mensaje recibido en tema ${topic}: ${message.toString()}`);
      
      // Actualizar el estado local cuando llegan mensajes MQTT
      obtenerDatosSensores();
    });

    client.current.on("offline", () => {
      console.log("❌ Cliente MQTT desconectado");
      setMqttConnected(false);
    });

    client.current.on("reconnect", () => {
      console.log("🔄 Intentando reconectar a MQTT...");
    });

    return () => {
      if (client.current) {
        console.log("🛑 Desconectando cliente MQTT");
        client.current.end();
      }
    };
  }, [macAddress]);

  // Función para actualizar el estado en la BD y enviar comando MQTT
  const actualizarEstado = async (tipo, nuevoEstado) => {
    try {
      // Primero actualizar en la base de datos
      const payload = {};
      if (tipo === "ventana") {
        payload.ventanaAbierta = nuevoEstado;
      } else if (tipo === "riego") {
        payload.riegoActivo = nuevoEstado;
      } else if (tipo === "ventilador") {
        payload.ventiladorActivo = nuevoEstado;
      }

      await instance.post(`/estado-dispositivo/${macAddress}`, payload);
      
      // Luego enviar el comando MQTT según el estado
      let topic, mensaje;
      
      if (tipo === "ventana") {
        topic = `mi/topico/servo/${macAddress}`;
        mensaje = nuevoEstado ? "abrir" : "cerrar";
      } else if (tipo === "riego") {
        topic = `mi/topico/riego/${macAddress}`;
        mensaje = nuevoEstado ? "activar" : "desactivar";
      } else if (tipo === "ventilador") {
        topic = `mi/topico/ventilador/${macAddress}`;
        mensaje = nuevoEstado ? "encender" : "apagar";
      }

      if (client.current && mqttConnected) {
        client.current.publish(
          topic,
          mensaje,
          { qos: 1, retain: false },
          (error) => {
            if (error) {
              console.error(`❌ Error al publicar en ${topic}:`, error);
            } else {
              console.log(`✅ Mensaje enviado a ${topic}: ${mensaje}`);
            }
          }
        );
      }

      // Actualizar los datos locales
      obtenerDatosSensores();
      
    } catch (error) {
      console.error("❌ Error al actualizar el estado:", error);
    }
  };

  // Función para actualizar velocidad del ventilador
  const actualizarVelocidad = async (velocidad) => {
    try {
      // Actualizar en la base de datos
      await instance.post(`/estado-dispositivo/${macAddress}`, {
        ventiladorVelocidad: velocidad
      });

      // Enviar comando MQTT
      if (client.current && mqttConnected) {
        const topic = `mi/topico/ventilador/speed/${macAddress}`;
        client.current.publish(
          topic,
          velocidad.toString(),
          { qos: 1, retain: false },
          (error) => {
            if (error) {
              console.error(`❌ Error al publicar en ${topic}:`, error);
            } else {
              console.log(`✅ Mensaje enviado a ${topic}: ${velocidad}`);
            }
          }
        );
      }

      // Actualizar los datos locales
      obtenerDatosSensores();
      
    } catch (error) {
      console.error("❌ Error al actualizar la velocidad:", error);
    }
  };

  // Resto del componente se mantiene igual...
  if (!macAddress) {
    return (
      <p className="IoT-error-message">Error: MAC Address no encontrado</p>
    );
  }

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

  const getStatusClass = (status) => {
    switch (status) {
      case "Óptima":
        return "IoT-status-optimal";
      case "Baja":
        return "IoT-status-low";
      case "Alta":
        return "IoT-status-high";
      default:
        return "IoT-status-unknown";
    }
  };

  return (
    <div className="IoT-dashboard-container">
      {/* Contenido JSX existente... */}
      <div className="IoT-dashboard-header">
        <h2 className="IoT-dashboard-title">Dashboard de Dispositivo IoT</h2>

        <div className="IoT-connection-widget">
          <div className="IoT-connection-card">
            <h3 className="IoT-card-header">Estado de Conexión</h3>
            <div className="IoT-connection-body">
              <div className="IoT-connection-status-item">
                <span className="IoT-connection-label">
                  Estado del dispositivo:
                </span>
                <div className="IoT-status-indicator-container">
                  <div
                    className={`IoT-status-indicator ${
                      mqttConnected ? "IoT-connected" : "IoT-disconnected"
                    }`}
                  ></div>
                  <span className="IoT-connection-text">
                    {mqttConnected ? "Conectado" : "Desconectado"}
                  </span>
                </div>
              </div>
              <div className="IoT-connection-status-item">
                <span className="IoT-connection-label">MAC Address:</span>
                <span className="IoT-mac-address">{macAddress}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón para ir al historial de acciones */}
      <div className="IoT-history-button-container">
        <Link
          to={`/historialAcciones/${macAddress}`}
          className="IoT-button IoT-button-secondary"
        >
          <div className="IoT-button-icon">
            <div className="IoT-icon-history">
              <div className="IoT-history-arrow"></div>
              <div className="IoT-history-circle"></div>
            </div>
          </div>
          <span className="IoT-button-text">Ver Historial de Acciones</span>
        </Link>
      </div>

      <div className="IoT-dashboard-grid">
        {/* Tarjeta de Temperatura */}
        <div className="IoT-metric-card">
          <div className="IoT-card-content">
            <div className="IoT-card-header">
              <div className="IoT-card-title">
                <div className="IoT-icon-thermometer">
                  <div className="IoT-thermometer-stem"></div>
                  <div className="IoT-thermometer-bulb"></div>
                  <div
                    className="IoT-thermometer-fill"
                    style={{
                      height: `${Math.min(
                        100,
                        Math.max(
                          0,
                          ((datosSensores.temperatura || 0) - 10) / 30
                        ) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
                <h3>Temperatura</h3>
              </div>
            </div>
            <div className="IoT-card-body">
              <div className="IoT-metric-value">
                {datosSensores.temperatura ?? 0}
                <span className="IoT-unit">°C</span>
              </div>
              <div className="IoT-progress-container">
                <div
                  className={`IoT-progress-bar ${getStatusClass(
                    obtenerEstadoTemperatura(datosSensores.temperatura)
                  )}`}
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, ((datosSensores.temperatura - 10) / 30) * 100)
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="IoT-metric-status">
                <span
                  className={`IoT-status-badge ${getStatusClass(
                    obtenerEstadoTemperatura(datosSensores.temperatura)
                  )}`}
                >
                  {obtenerEstadoTemperatura(datosSensores.temperatura)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta de Humedad */}
        <div className="IoT-metric-card">
          <div className="IoT-card-content">
            <div className="IoT-card-header">
              <div className="IoT-card-title">
                <div className="IoT-icon-humidity">
                  <div className="IoT-humidity-drop"></div>
                  <div className="IoT-humidity-waves">
                    <div className="IoT-humidity-wave"></div>
                    <div className="IoT-humidity-wave"></div>
                  </div>
                </div>
                <h3>Humedad</h3>
              </div>
            </div>
            <div className="IoT-card-body">
              <div className="IoT-metric-value">
                {datosSensores.humedad ?? 0}
                <span className="IoT-unit">%</span>
              </div>
              <div className="IoT-progress-container">
                <div
                  className={`IoT-progress-bar ${getStatusClass(
                    obtenerEstadoHumedad(datosSensores.humedad)
                  )}`}
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, datosSensores.humedad)
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="IoT-metric-status">
                <span
                  className={`IoT-status-badge ${getStatusClass(
                    obtenerEstadoHumedad(datosSensores.humedad)
                  )}`}
                >
                  {obtenerEstadoHumedad(datosSensores.humedad)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta de Humedad del Suelo */}
        <div className="IoT-metric-card">
          <div className="IoT-card-content">
            <div className="IoT-card-header">
              <div className="IoT-card-title">
                <div className="IoT-icon-soil">
                  <div className="IoT-soil-surface"></div>
                  <div className="IoT-soil-plant">
                    <div className="IoT-plant-stem"></div>
                    <div className="IoT-plant-leaf IoT-plant-leaf-left"></div>
                    <div className="IoT-plant-leaf IoT-plant-leaf-right"></div>
                  </div>
                </div>
                <h3>Humedad Suelo</h3>
              </div>
            </div>
            <div className="IoT-card-body">
              <div className="IoT-metric-value">
                {datosSensores.humedadSuelo ?? 0}
                <span className="IoT-unit">%</span>
              </div>
              <div className="IoT-progress-container">
                <div
                  className="IoT-progress-bar"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, datosSensores.humedadSuelo)
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta de Control de Ventana */}
        <div className="IoT-control-card">
          <div className="IoT-card-content">
            <div className="IoT-card-header">
              <div className="IoT-card-title">
                <div className="IoT-icon-window">
                  <div className="IoT-window-frame">
                    <div className="IoT-window-glass"></div>
                    <div className="IoT-window-handle"></div>
                  </div>
                </div>
                <h3>Control de Ventana</h3>
              </div>
            </div>
            <div className="IoT-card-body">
              <div className="IoT-control-status">
                Estado:{" "}
                <strong>
                  {datosSensores.ventanaAbierta ? "Abierta" : "Cerrada"}
                </strong>
              </div>
              <div className="IoT-control-buttons">
                <button
                  className="IoT-button IoT-button-primary"
                  onClick={() => actualizarEstado("ventana", true)}
                  disabled={!mqttConnected || datosSensores.ventanaAbierta}
                >
                  <span className="IoT-button-text">Abrir Ventana</span>
                </button>
                <button
                  className="IoT-button IoT-button-danger"
                  onClick={() => actualizarEstado("ventana", false)}
                  disabled={!mqttConnected || !datosSensores.ventanaAbierta}
                >
                  <span className="IoT-button-text">Cerrar Ventana</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta de Control de Ventilador */}
        <div className="IoT-control-card">
          <div className="IoT-card-content">
            <div className="IoT-card-header">
              <div className="IoT-card-title">
                <div className="IoT-icon-fan">
                  <div className="IoT-fan-center"></div>
                  <div className="IoT-fan-blades">
                    <div className="IoT-fan-blade IoT-fan-blade-1"></div>
                    <div className="IoT-fan-blade IoT-fan-blade-2"></div>
                    <div className="IoT-fan-blade IoT-fan-blade-3"></div>
                  </div>
                </div>
                <h3>Control de Ventilador</h3>
              </div>
            </div>
            <div className="IoT-card-body">
              <div className="IoT-control-status">
                Estado:{" "}
                <strong>
                  {datosSensores.ventiladorActivo ? "Encendido" : "Apagado"}
                </strong>
              </div>
              <div className="IoT-control-buttons">
                <button
                  className="IoT-button IoT-button-primary"
                  onClick={() => actualizarEstado("ventilador", true)}
                  disabled={!mqttConnected || datosSensores.ventiladorActivo}
                >
                  <span className="IoT-button-text">Encender Ventiladores</span>
                </button>
                <button
                  className="IoT-button IoT-button-danger"
                  onClick={() => actualizarEstado("ventilador", false)}
                  disabled={!mqttConnected || !datosSensores.ventiladorActivo}
                >
                  <span className="IoT-button-text">Apagar Ventiladores</span>
                </button>
              </div>
              <div className="IoT-speed-control">
                <label className="IoT-speed-label">
                  Velocidad: {datosSensores.ventiladorVelocidad || 0}
                </label>
                <div className="IoT-slider-container">
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={datosSensores.ventiladorVelocidad || 0}
                    onChange={(e) => actualizarVelocidad(e.target.value)}
                    disabled={!mqttConnected}
                    className="IoT-slider"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta de Sistema de Riego */}
        <div className="IoT-control-card">
          <div className="IoT-card-content">
            <div className="IoT-card-header">
              <div className="IoT-card-title">
                <div className="IoT-icon-irrigation">
                  <div className="IoT-irrigation-sprinkler">
                    <div className="IoT-sprinkler-head"></div>
                    <div className="IoT-sprinkler-base"></div>
                    <div className="IoT-water-drops">
                      <div className="IoT-water-drop IoT-water-drop-1"></div>
                      <div className="IoT-water-drop IoT-water-drop-2"></div>
                      <div className="IoT-water-drop IoT-water-drop-3"></div>
                    </div>
                  </div>
                </div>
                <h3>Sistema de Riego</h3>
              </div>
            </div>
            <div className="IoT-card-body">
              <div className="IoT-control-status">
                Estado:{" "}
                <strong>
                  {datosSensores.riegoActivo ? "Activo" : "Inactivo"}
                </strong>
              </div>
              <div className="IoT-control-buttons">
                <button
                  className="IoT-button IoT-button-primary"
                  onClick={() => actualizarEstado("riego", true)}
                  disabled={!mqttConnected || datosSensores.riegoActivo}
                >
                  <span className="IoT-button-text">Activar Riego</span>
                </button>
                <button
                  className="IoT-button IoT-button-danger"
                  onClick={() => actualizarEstado("riego", false)}
                  disabled={!mqttConnected || !datosSensores.riegoActivo}
                >
                  <span className="IoT-button-text">Desactivar Riego</span>
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


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
      const response = await instance.get(`/estado-dispositivo/${macAddress}/ultimo`);
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

  // Usar un intervalo para obtener los datos cada minuto
  useEffect(() => {
    if (!macAddress) return; // Si no hay macAddress, no hacer nada

    obtenerDatosSensores(); // Inicializa la obtención de datos al montar el componente

    const intervalId = setInterval(() => {
      obtenerDatosSensores(); // Actualiza los datos cada 1 minuto (2000 ms)
    }, 2000);

    return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonte
  }, [macAddress]); // Añadimos macAddress como dependencia

  // Configurar una suscripción a cambios en la base de datos
  useEffect(() => {
    if (!macAddress) return;

    // Establecer WebSocket o EventSource para escuchar cambios en la BD
    const eventSource = new EventSource(`/api/device-updates/${macAddress}`);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Si hay cambios en los datos, actualizar el estado
      if (data.updated) {
        obtenerDatosSensores();
      }
    };

    return () => {
      // Cerrar la conexión cuando el componente se desmonte
      eventSource.close();
    };
  }, [macAddress]);

  // Configuración de MQTT
  useEffect(() => {
    if (!macAddress) return;

    const mqttOptions = {
      clientId: `frontend-${macAddress}-${Math.random().toString(16).substring(2, 8)}`,
      username: "moy19",
      password: "moy19",
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
    };

    const url = "wss://raba7554.ala.dedicated.aws.emqxcloud.com:8083/mqtt";
    client.current = MQTT.connect(url, mqttOptions);

    client.current.on("connect", () => {
      console.log("✅ Conexión MQTT establecida correctamente");
      setMqttConnected(true);

      const topics = [
        `mi/topico/servo/${macAddress}`,
        `mi/topico/riego/${macAddress}`,
        `mi/topico/ventilador/${macAddress}`,
        `mi/topico/ventilador/speed/${macAddress}`,
        // Añadir un topic para escuchar actualizaciones de la BD
        `mi/topico/database-updates/${macAddress}`,
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

      if (topic.includes("servo")) {
        setLastCommands((prev) => ({ ...prev, servo: message.toString() }));
        obtenerDatosSensores(); // Actualizar cuando cambia el estado del servo
      } else if (topic.includes("riego")) {
        setLastCommands((prev) => ({ ...prev, riego: message.toString() }));
        obtenerDatosSensores(); // Actualizar cuando cambia el estado del riego
      } else if (topic.includes("speed")) {
        setLastCommands((prev) => ({ ...prev, velocidad: message.toString() }));
        obtenerDatosSensores(); // Actualizar cuando cambia la velocidad
      } else if (topic.includes("ventilador") && !topic.includes("speed")) {
        setLastCommands((prev) => ({
          ...prev,
          ventilador: message.toString(),
        }));
        obtenerDatosSensores(); // Actualizar cuando cambia el estado del ventilador
      } else if (topic.includes("database-updates")) {
        // Actualizar cuando hay cambios en la base de datos
        obtenerDatosSensores();
      }
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
  }, [macAddress]); // `macAddress` es necesario para MQTT

  // Función para registrar acción en el historial
  const registrarAccion = async (tipoAccion, estadoAnterior, estadoNuevo) => {
    try {
      await instance.post("/historial-acciones", {
        macAddress,
        accion: tipoAccion,
        estadoAnterior,
        estadoNuevo,
      });
      console.log(`✅ Acción ${tipoAccion} registrada en el historial`);
      
      // Actualizar datos de sensores después de registrar una acción
      obtenerDatosSensores();
    } catch (error) {
      console.error("❌ Error al registrar la acción:", error);
    }
  };

  // Función para publicar mensajes MQTT
  const publicarMensaje = async (tipo, comando) => {
    if (!client.current || !mqttConnected) {
      console.error("❌ Cliente MQTT no conectado");
      return;
    }

    let topic1, topic2;
    const comandoStr = String(comando);

    // Obtener el estado actual del actuador
    let estadoAnterior;
    let tipoAccion;

    switch (tipo) {
      case "servo":
        estadoAnterior = datosSensores.ventanaAbierta ? "Abierta" : "Cerrada";
        tipoAccion = "ventana";
        break;
      case "riego":
        estadoAnterior = datosSensores.riegoActivo ? "Activo" : "Inactivo";
        tipoAccion = "riego";
        break;
      case "ventilador":
        estadoAnterior = datosSensores.ventiladorActivo ? "Encendido" : "Apagado";
        tipoAccion = "ventilador";
        break;
      case "velocidad":
        estadoAnterior = datosSensores.ventiladorVelocidad.toString();
        tipoAccion = "ventilador";
        break;
      default:
        console.error("Tipo de comando no válido");
        return;
    }

    // Publicar el mensaje MQTT para ambos ventiladores
    if (tipo === "ventilador") {
      topic1 = `mi/topico/ventilador1/${macAddress}`;
      topic2 = `mi/topico/ventilador2/${macAddress}`;

      // Enviar comando a ventilador 1
      client.current.publish(
        topic1,
        comandoStr,
        { qos: 1, retain: false },
        async (error) => {
          if (error) {
            console.error(`❌ Error al publicar en ${topic1}:`, error);
          } else {
            console.log(`✅ Mensaje enviado a ${topic1}: ${comandoStr}`);
            await registrarAccion(tipoAccion, estadoAnterior, comandoStr);
            // Actualizar datos después de enviar el comando
            obtenerDatosSensores();
          }
        }
      );

      // Enviar comando a ventilador 2
      client.current.publish(
        topic2,
        comandoStr,
        { qos: 1, retain: false },
        async (error) => {
          if (error) {
            console.error(`❌ Error al publicar en ${topic2}:`, error);
          } else {
            console.log(`✅ Mensaje enviado a ${topic2}: ${comandoStr}`);
            await registrarAccion(tipoAccion, estadoAnterior, comandoStr);
            // Actualizar datos después de enviar el comando
            obtenerDatosSensores();
          }
        }
      );
    } else {
      // Lógica para otros tipos de comandos (servo, riego, etc.)
      let topic;
      switch (tipo) {
        case "servo":
          topic = `mi/topico/servo/${macAddress}`;
          setLastCommands((prev) => ({ ...prev, servo: comandoStr }));
          break;
        case "riego":
          topic = `mi/topico/riego/${macAddress}`;
          setLastCommands((prev) => ({ ...prev, riego: comandoStr }));
          break;
        case "velocidad":
          topic = `mi/topico/ventilador/speed/${macAddress}`;
          setLastCommands((prev) => ({ ...prev, velocidad: comandoStr }));
          break;
        default:
          console.error("Tipo de comando no válido");
          return;
      }

      client.current.publish(
        topic,
        comandoStr,
        { qos: 1, retain: false },
        async (error) => {
          if (error) {
            console.error(`❌ Error al publicar en ${topic}:`, error);
          } else {
            console.log(`✅ Mensaje enviado a ${topic}: ${comandoStr}`);
            await registrarAccion(tipoAccion, estadoAnterior, comandoStr);
            // Actualizar datos después de enviar el comando
            obtenerDatosSensores();
          }
        }
      );
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
                        Math.max(0, ((datosSensores.temperatura || 0) - 10) / 30) * 100
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
                    width: `${Math.min(100, Math.max(0, datosSensores.humedad))}%`,
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
                    width: `${Math.min(100, Math.max(0, datosSensores.humedadSuelo))}%`,
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
                <strong>{datosSensores.ventanaAbierta ? "Abierta" : "Cerrada"}</strong>
              </div>
              <div className="IoT-control-buttons">
                <button
                  className="IoT-button IoT-button-primary"
                  onClick={() => publicarMensaje("servo", "abrir")}
                  disabled={!mqttConnected}
                >
                  <span className="IoT-button-text">Abrir Ventana</span>
                </button>
                <button
                  className="IoT-button IoT-button-danger"
                  onClick={() => publicarMensaje("servo", "cerrar")}
                  disabled={!mqttConnected}
                >
                  <span className="IoT-button-text">Cerrar Ventana</span>
                </button>
              </div>
              <div className="IoT-command-info">
                Último comando:{" "}
                <span className="IoT-command-value">
                  {lastCommands.servo || "Ninguno"}
                </span>
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
                  onClick={() => publicarMensaje("ventilador", "encender")}
                  disabled={!mqttConnected}
                >
                  <span className="IoT-button-text">Encender Ventiladores</span>
                </button>
                <button
                  className="IoT-button IoT-button-danger"
                  onClick={() => publicarMensaje("ventilador", "apagar")}
                  disabled={!mqttConnected}
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
                    onChange={(e) =>
                      publicarMensaje("velocidad", e.target.value)
                    }
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
                <strong>{datosSensores.riegoActivo ? "Activo" : "Inactivo"}</strong>
              </div>
              <div className="IoT-control-buttons">
                <button
                  className="IoT-button IoT-button-primary"
                  onClick={() => publicarMensaje("riego", "activar")}
                  disabled={!mqttConnected}
                >
                  <span className="IoT-button-text">Activar Riego</span>
                </button>
                <button
                  className="IoT-button IoT-button-danger"
                  onClick={() => publicarMensaje("riego", "desactivar")}
                  disabled={!mqttConnected}
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

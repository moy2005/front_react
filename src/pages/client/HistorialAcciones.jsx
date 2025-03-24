import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import instance from "../../api/axios";
import "../../styles/IotHistorial.css";

const HistorialAcciones = () => {
  const { macAddress } = useParams();
  const [acciones, setAcciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroAccion, setFiltroAccion] = useState("todas");
  const [resumenDiario, setResumenDiario] = useState({});

  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        setLoading(true);
        let response;
        
        if (filtroAccion === "todas") {
          response = await instance.get(`/historial/${macAddress}`);
        } else {
          response = await instance.get(`/historial-acciones/${macAddress}/${filtroAccion}`);
        }
        
        setAcciones(response.data);
        setError(null);
      } catch (error) {
        console.error("Error al obtener historial de acciones:", error);
        setError("No se pudo cargar el historial de acciones");
        setAcciones([]);
      } finally {
        setLoading(false);
      }
    };

    const obtenerResumenDiario = async () => {
      try {
        const response = await instance.get(`/historial-acciones/${macAddress}/resumen/diario`);
        setResumenDiario(response.data);
      } catch (error) {
        console.error("Error al obtener resumen diario:", error);
      }
    };

    obtenerHistorial();
    obtenerResumenDiario();
  }, [macAddress, filtroAccion]);

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString();
  };

  const getAccionIcon = (accion) => {
    switch (accion) {
      case "ventilador":
        return "🌬️";
      case "ventana":
        return "🪟";
      case "riego":
        return "💧";
      default:
        return "🔄";
    }
  };

  const getAccionColor = (accion) => {
    switch (accion) {
      case "ventilador":
        return "IoT-ventilador-color";
      case "ventana":
        return "IoT-ventana-color";
      case "riego":
        return "IoT-riego-color";
      default:
        return "";
    }
  };

  return (
    <div className="IoT-historial-container">
      <div className="IoT-historial-header">
        <h2 className="IoT-historial-title">Historial de Acciones</h2>
        <div className="IoT-historial-subtitle">
          <span>Dispositivo: </span>
          <span className="IoT-mac-address">{macAddress}</span>
        </div>
      </div>

      <div className="IoT-historial-filters">
        <div className="IoT-filtro-grupo">
          <label htmlFor="filtroAccion">Filtrar por tipo:</label>
          <select
            id="filtroAccion"
            value={filtroAccion}
            onChange={(e) => setFiltroAccion(e.target.value)}
            className="IoT-filtro-select"
          >
            <option value="todas">Todas las acciones</option>
            <option value="ventilador">Ventilador</option>
            <option value="ventana">Ventana</option>
            <option value="riego">Riego</option>
          </select>
        </div>
      </div>

      <div className="IoT-historial-resumen">
        <h3 className="IoT-historial-resumen-title">Resumen Diario</h3>
        <div className="IoT-historial-resumen-grid">
          {Object.entries(resumenDiario).map(([fecha, datos]) => (
            <div key={fecha} className="IoT-historial-resumen-card">
              <div className="IoT-historial-resumen-fecha">{fecha}</div>
              <div className="IoT-historial-resumen-acciones">
                <div className="IoT-historial-resumen-accion">
                  <span className="IoT-historial-resumen-icon">🪟</span>
                  <span className="IoT-historial-resumen-label">Ventana:</span>
                  <span className="IoT-historial-resumen-value">
                    {datos.ventana || 0}
                  </span>
                </div>
                <div className="IoT-historial-resumen-accion">
                  <span className="IoT-historial-resumen-icon">🌬️</span>
                  <span className="IoT-historial-resumen-label">Ventilador:</span>
                  <span className="IoT-historial-resumen-value">
                    {datos.ventilador || 0}
                  </span>
                </div>
                <div className="IoT-historial-resumen-accion">
                  <span className="IoT-historial-resumen-icon">💧</span>
                  <span className="IoT-historial-resumen-label">Riego:</span>
                  <span className="IoT-historial-resumen-value">
                    {datos.riego || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="IoT-historial-lista">
        <h3 className="IoT-historial-lista-title">Lista de Acciones</h3>
        
        {loading ? (
          <div className="IoT-loading">Cargando historial...</div>
        ) : error ? (
          <div className="IoT-error">{error}</div>
        ) : acciones.length === 0 ? (
          <div className="IoT-no-data">No hay acciones registradas</div>
        ) : (
          <div className="IoT-historial-timeline">
            {acciones.map((accion) => (
              <div key={accion._id} className="IoT-historial-item">
                <div className={`IoT-historial-icon ${getAccionColor(accion.accion)}`}>
                  {getAccionIcon(accion.accion)}
                </div>
                <div className="IoT-historial-content">
                  <div className="IoT-historial-accion-tipo">
                    {accion.accion === "ventilador" && "Ventilador"}
                    {accion.accion === "ventana" && "Ventana"}
                    {accion.accion === "riego" && "Riego"}
                  </div>
                  <div className="IoT-historial-estado">
                    <span className="IoT-historial-estado-anterior">
                      {accion.estadoAnterior}
                    </span>
                    <span className="IoT-historial-flecha">➡️</span>
                    <span className="IoT-historial-estado-nuevo">
                      {accion.estadoNuevo}
                    </span>
                  </div>
                  <div className="IoT-historial-fecha">
                    {formatearFecha(accion.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorialAcciones;


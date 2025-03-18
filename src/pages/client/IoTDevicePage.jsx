import React,{useState} from 'react'
import '../../styles/IoT.css'

function IoTDevicePage() {
  const [lightStatus, setLightStatus] = useState({
    active: false,
    value: 500 // Lux
  });
  
  const [fanStatus, setFanStatus] = useState({
    active: false,
    value: 25 // Porcentaje de velocidad
  });
  
  const [irrigationStatus, setIrrigationStatus] = useState({
    active: false,
    value: 40 // Porcentaje de humedad
  });

  const toggleLight = () => {
    setLightStatus(prev => ({
      ...prev,
      active: !prev.active
    }));
  };

  const toggleFan = () => {
    setFanStatus(prev => ({
      ...prev,
      active: !prev.active
    }));
  };

  const toggleIrrigation = () => {
    setIrrigationStatus(prev => ({
      ...prev,
      active: !prev.active
    }));
  };

  return (
    <div className="greenhouse-container">
      <div className="greenhouse-header">
        <h1>Invernadero Automatizado</h1>
        <p className="greenhouse-subtitle">Panel de Control</p>
      </div>
      
      <div className="devices-container">
        {/* Control de Iluminación */}
        <div className="device-card">
          <div className="device-icon-container">
            {lightStatus.active ? 
              <div className="light-icon active"></div> :
              <div className="light-icon"></div>
            }
          </div>
          <div className="device-info">
            <h2>Iluminación</h2>
            <div className="status-display">
              <span className="value-display">{lightStatus.value} lux</span>
              <span className={`status-badge ${lightStatus.active ? 'active' : 'inactive'}`}>
                {lightStatus.active ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div className="control-buttons">
              <button 
                className={`control-btn ${lightStatus.active ? 'on-btn' : 'off-btn'}`}
                onClick={toggleLight}
              >
                {lightStatus.active ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        </div>

        {/* Control de Ventilación */}
        <div className="device-card">
          <div className="device-icon-container">
            {fanStatus.active ? 
              <div className="fan-icon active"></div> :
              <div className="fan-icon"></div>
            }
          </div>
          <div className="device-info">
            <h2>Ventilador</h2>
            <div className="status-display">
              <span className="value-display">{fanStatus.value}% potencia</span>
              <span className={`status-badge ${fanStatus.active ? 'active' : 'inactive'}`}>
                {fanStatus.active ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div className="control-buttons">
              <button 
                className={`control-btn ${fanStatus.active ? 'on-btn' : 'off-btn'}`}
                onClick={toggleFan}
              >
                {fanStatus.active ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        </div>

        {/* Control de Riego */}
        <div className="device-card">
          <div className="device-icon-container">
            {irrigationStatus.active ? 
              <div className="irrigation-icon active"></div> :
              <div className="irrigation-icon"></div>
            }
          </div>
          <div className="device-info">
            <h2>Sistema de Riego</h2>
            <div className="status-display">
              <span className="value-display">{irrigationStatus.value}% humedad</span>
              <span className={`status-badge ${irrigationStatus.active ? 'active' : 'inactive'}`}>
                {irrigationStatus.active ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div className="control-buttons">
              <button 
                className={`control-btn ${irrigationStatus.active ? 'on-btn' : 'off-btn'}`}
                onClick={toggleIrrigation}
              >
                {irrigationStatus.active ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-footer">
        <p>Actualizado: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
}

export default IoTDevicePage;


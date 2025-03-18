import React from "react";
import { FaUser, FaEnvelope, FaPhone, FaUserTag, FaKey, FaCalendarAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function UserDetailsModal({ user, onClose }) {
  // Formato de fecha para createdAt y updatedAt
  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'de' yyyy 'a las' HH:mm:ss", { locale: es });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Detalles del Usuario</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="user-info-header">
            <div className="user-avatar">
              {user.realName.charAt(0)}{user.lastName.charAt(0)}
            </div>
            <div className="user-primary-info">
              <h3>{`${user.realName} ${user.lastName}`}</h3>
              <p className={`user-role ${user.role === "admin" ? "admin-role" : "client-role"}`}>
                {user.role === "admin" ? "Administrador" : "Cliente"}
              </p>
              <p className={`user-status ${user.isVerified ? "verified" : "unverified"}`}>
                {user.isVerified ? <><FaCheckCircle /> Verificado</> : <><FaTimesCircle /> No verificado</>}
              </p>
            </div>
          </div>

          <div className="user-details-grid">
            <div className="detail-item">
              <div className="detail-icon"><FaUser /></div>
              <div className="detail-content">
                <span className="detail-label">Nombre completo</span>
                <span className="detail-value">{`${user.realName} ${user.lastName}`}</span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon"><FaEnvelope /></div>
              <div className="detail-content">
                <span className="detail-label">Correo electrónico</span>
                <span className="detail-value">{user.email}</span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon"><FaPhone /></div>
              <div className="detail-content">
                <span className="detail-label">Teléfono</span>
                <span className="detail-value">{user.phoneNumber}</span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon"><FaUserTag /></div>
              <div className="detail-content">
                <span className="detail-label">Rol</span>
                <span className="detail-value">{user.role === "admin" ? "Administrador" : "Cliente"}</span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon"><FaKey /></div>
              <div className="detail-content">
                <span className="detail-label">Palabra secreta</span>
                <span className="detail-value">••••••••</span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon"><FaCalendarAlt /></div>
              <div className="detail-content">
                <span className="detail-label">Fecha de creación</span>
                <span className="detail-value">{formatDate(user.createdAt)}</span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon"><FaCalendarAlt /></div>
              <div className="detail-content">
                <span className="detail-label">Última actualización</span>
                <span className="detail-value">{formatDate(user.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="close-modal-btn" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsModal;
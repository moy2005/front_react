import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaBox, FaPaw, FaBuilding, FaMicrochip, FaEdit, FaSignOutAlt } from 'react-icons/fa';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from '../../context/AuthContext';
import Modal from 'react-modal';
// Changed import to match regular ProfilePage
// import '../../styles/profileAdmin.css';

// Configurar el elemento raíz de la aplicación para react-modal
Modal.setAppElement('#root');

function ProfilePageAdmin() {
  const { user, logout, updateUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    realName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    secretWord: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        realName: user.realName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        secretWord: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validar contraseñas si se intenta cambiar
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("Las contraseñas nuevas no coinciden");
        setLoading(false);
        return;
      }
    }

    try {
      // Verificar si el usuario está autenticado y tiene un ID
      if (!user || !user.id) {
        throw new Error("ID de usuario no disponible. Por favor, inicia sesión nuevamente.");
      }

      // Preparar datos para la actualización (eliminar confirmPassword)
      const updateData = { ...formData };
      delete updateData.confirmPassword;

      // Solo incluir campos de contraseña si se está actualizando la contraseña
      if (!updateData.newPassword) {
        delete updateData.currentPassword;
        delete updateData.newPassword;
      }

      await updateUser(user.id, updateData);
      toast.success("Datos actualizados correctamente");
      closeModal();
    } catch (error) {
      toast.error(error.message || "Error al actualizar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.info("Sesión cerrada correctamente");
  };

  if (!user) {
    return (
      <div className="admin-profile-loading">
        <p>Cargando datos de usuario...</p>
      </div>
    );
  }

  return (
    <div className="admin-profile-container">
      <div className="admin-profile-header">
        <div className="admin-welcome-section">
          <h1 className="admin-welcome-title">
            Bienvenido, <span className="admin-username">{user.realName}</span>
          </h1>
        </div>
        <div className="admin-actions">
          <button className="admin-edit-button" onClick={openModal}>
            <FaEdit /> Editar Perfil
          </button>
        </div>
      </div>

      <div className="admin-dashboard-grid">
        <Link to="/manage-products" className="admin-dashboard-card products-card">
          <div className="admin-card-icon">
            <FaBox />
          </div>
          <div className="admin-card-content">
            <h2>Gestión de Productos</h2>
            <p>Administrar Productos</p>
          </div>
        </Link>

        <Link to="/users-management" className="admin-dashboard-card users-card">
          <div className="admin-card-icon">
            <FaUser />
          </div>
          <div className="admin-card-content">
            <h2>Gestión de Usuarios</h2>
            <p>Administrar Clientes</p>
          </div>
        </Link>

        <Link to="/dispositivos-manage" className="admin-dashboard-card devices-card">
          <div className="admin-card-icon">
            <FaMicrochip />
          </div>
          <div className="admin-card-content">
            <h2>Dispositivos IoT</h2>
            <p>Monitoreo y control de equipos</p>
          </div>
        </Link>

        <Link to="/empresa-manage" className="admin-dashboard-card company-card">
          <div className="admin-card-icon">
            <FaBuilding />
          </div>
          <div className="admin-card-content">
            <h2>Gestión de Empresa</h2>
            <p>Administrar Empresa</p>
          </div>
        </Link>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Editar Perfil"
        className="admin-profile-modal"
        overlayClassName="admin-profile-modal-overlay"
      >
        <div className="admin-profile-modal-header">
          <h2>Editar Datos Personales</h2>
          <button className="admin-modal-close" onClick={closeModal}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="admin-profile-form">
          <div className="admin-form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="realName"
              value={formData.realName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Apellido</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Palabra Secreta</label>
            <input
              type="password"
              name="secretWord"
              value={formData.secretWord}
              onChange={handleChange}
            />
          </div>

          <div className="admin-form-section">
        
            <div className="admin-form-group">
              <label>Contraseña Actual</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label>Nueva Contraseña</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label>Confirmar Nueva Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="button" className="admin-cancel-button" onClick={closeModal}>
              Cancelar
            </button>
            <button type="submit" className="admin-save-button" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ProfilePageAdmin;
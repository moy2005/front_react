import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import '../../styles/tableUsers.css';
import UserDetailsModal from "../../components/UserDetailsModal";
import { FaPlus, FaEdit, FaTrash, FaEye, FaUser, FaEnvelope, FaPhone, FaUserTag } from 'react-icons/fa';

function UsersManagementPage() {
  const { getUsers, deleteUser, updateUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState({ text: "", type: "" });
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const [usersPerPage] = useState(10); // Número de usuarios por página

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
        setError(null);
      } catch (err) {
        setError("Hubo un error al cargar los usuarios.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reinicia la página a 1 al realizar una búsqueda
  };

  const filteredUsers = users.filter((user) =>
    (user.realName?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
    (user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
    (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
    (user.role?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
    (searchTerm.toLowerCase() === "verificado" && user.isVerified === true) ||
    (searchTerm.toLowerCase() === "no verificado" && user.isVerified === false)
  );

  // Lógica de paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>{error}</p>
        <button 
          className="retry-btn" 
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="empty-state">
        <FaUser size={40} color="#95a5a6" />
        <h3>No hay usuarios disponibles</h3>
        <p>No se encontraron usuarios en el sistema.</p>
        <Link to="/users/create" className="create-btn">
          <FaPlus /> Crear Usuario
        </Link>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">Gestión de Usuarios</h2>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <Link className="create-btn">
          <FaPlus /> 
        </Link>
      </div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th><span className="th-content"><FaUser /> Nombre</span></th>
              <th><span className="th-content"><FaUser /> Apellido</span></th>
              <th><span className="th-content"><FaEnvelope /> Email</span></th>
              <th><span className="th-content"><FaUserTag /> Rol</span></th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.realName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td className={`role-column ${user.role === "admin" ? "admin-role" : "client-role"}`}>
                  {user.role === "admin" ? "Administrador" : "Cliente"}
                </td>
                <td className="user-actions">
                  <button
                    className="view-btn"
                    onClick={() => openModal(user)}
                    title="Ver detalles"
                  >
                    <FaEye />
                  </button>
                  <button
                    className="update-btn"
                    onClick={() => openRoleModal(user)}
                    title="Cambiar rol"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user._id)}
                    title="Eliminar usuario"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Anterior
        </button>
        <span className="pagination-info">
          Página {currentPage} de {Math.ceil(filteredUsers.length / usersPerPage)}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
          className="pagination-btn"
        >
          Siguiente
        </button>
      </div>

      {showModal && selectedUser && (
        <UserDetailsModal 
          user={selectedUser} 
          onClose={() => setShowModal(false)} 
        />
      )}

      {/* Modal para editar el rol */}
      {showRoleModal && userToEdit && (
        <div className="user-modal-overlay">
          <div className="user-modal">
            <div className="user-modal-header">
              <h3>Editar Rol de Usuario</h3>
              <button 
                className="user-modal-close" 
                onClick={() => setShowRoleModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="user-modal-body">
              <p>
                <strong>Usuario:</strong> {userToEdit.realName} {userToEdit.lastName}
              </p>
              <p>
                <strong>Email:</strong> {userToEdit.email}
              </p>
              <div className="user-form-group">
                <label>Rol:</label>
                <select 
                  value={selectedRole} 
                  onChange={handleRoleChange}
                  className="user-select"
                  disabled={updateLoading}
                >
                  <option value="cliente">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              {updateMessage.text && (
                <div className={`user-message ${updateMessage.type === "success" ? "user-success" : "user-error"}`}>
                  {updateMessage.text}
                </div>
              )}
            </div>
            <div className="user-modal-footer">
              <button 
                className="user-cancel-btn" 
                onClick={() => setShowRoleModal(false)}
                disabled={updateLoading}
              >
                Cancelar
              </button>
              <button 
                className="user-save-btn" 
                onClick={handleRoleUpdate}
                disabled={updateLoading || selectedRole === userToEdit.role}
              >
                {updateLoading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersManagementPage;


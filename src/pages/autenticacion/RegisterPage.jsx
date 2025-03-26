import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash, FaKey } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/register.css";

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const { register, handleSubmit, getValues, watch, formState: { errors } } = useForm({
    mode: 'onChange'
  });

  const { signup, isAuthenticated, errors: registerErrors } = useAuth();
  const navigate = useNavigate();

  // Mostrar errores del servidor usando toastify
  useEffect(() => {
    if (!registerErrors) return;

    // Si es un string, mostrarlo directamente
    if (typeof registerErrors === 'string') {
      toast.error(registerErrors);
    }

    // Si es un array, mostrar cada error
    else if (Array.isArray(registerErrors)) {
      registerErrors.forEach(error => toast.error(error));
    }

    // Si es un objeto, mostrar los valores
    else if (typeof registerErrors === 'object') {
      Object.values(registerErrors).forEach(error => toast.error(error));
    }
  }, [registerErrors]);

  const watchPassword = watch("password", "");
  const watchConfirmPassword = watch("confirmPassword", "");
  const watchEmail = watch("email", "");
  const watchPhone = watch("phoneNumber", "");

  useEffect(() => {
    if (isAuthenticated) navigate("/login");
  }, [isAuthenticated]);

  // Modificar el onSubmit para el nuevo flujo sin verificación
  const onSubmit = async (values) => {
    try {
      const result = await signup(values);
      if (result?.success) {
        toast.success("¡Registro exitoso! Ahora puedes iniciar sesión.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error durante el registro:", error);
      toast.error("Ocurrió un error durante el registro. Inténtalo de nuevo.");
    }
  };

  // Funciones de validación secuencial (se mantienen igual)
  const getPasswordFirstError = (password) => {
    if (password.length < 8) return "Mínimo 8 caracteres";
    if (!/[A-Z]/.test(password)) return "Debe contener al menos una mayúscula";
    if (!/[a-z]/.test(password)) return "Debe contener al menos una minúscula";
    if (!/\d/.test(password)) return "Debe contener al menos un número";
    if (!/[@$!%*?&]/.test(password)) return "Debe contener al menos un símbolo especial (@$!%*?&)";
    return null;
  };

  const getEmailFirstError = (email) => {
    if (!email) return "El correo es requerido";
    if (!email.includes('@')) return "Debe contener @";
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) return "Formato de correo inválido";
    return null;
  };

  const getPhoneFirstError = (phone) => {
    if (!phone) return "El número es requerido";
    if (!/^\d+$/.test(phone)) return "Solo debe contener números";
    if (phone.length !== 10) return "Debe tener exactamente 10 dígitos";
    return null;
  };

  const getNameFirstError = (name, fieldName) => {
    if (!name) return `${fieldName} es requerido`;
    if (name.length < 2) return "Mínimo 2 caracteres";
    if (name.length > 50) return "Máximo 50 caracteres";
    return null;
  };

  return (
    <div className="fondo">
      <div className="register-container txt">
        <div className="register-box">
          <h1 className="register-title h1-form">Registro</h1>
          
          <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
              {/* Columna izquierda */}
              <div className="form-column">
                {/* Nombre real */}
                <div className="form-field">
                  <label htmlFor="realName" className="input-label">Nombre</label>
                  <div className="input-with-icon">
                    <div className="input-icon">
                      <FaUser />
                    </div>    
                    <input
                      type="text"
                      {...register("realName", {
                        required: true,
                        minLength: 2,
                        maxLength: 50
                      })}
                      className="input-field txt"
                      placeholder="Nombre de usuario"
                    />
                  </div>
                  {watch("realName") !== undefined && (
                    <div className="requirement-message">
                      {getNameFirstError(watch("realName"), "Nombre")}
                    </div>
                  )}
                </div>

                {/* Correo electrónico */}
                <div className="form-field">
                  <label htmlFor="email" className="input-label">Correo electrónico</label>
                  <div className="input-with-icon">
                    <div className="input-icon">
                      <FaEnvelope />
                    </div>
                    <input
                      type="email"
                      {...register("email", {
                        required: true,
                        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                      })}
                      className="input-field txt"
                      placeholder="Correo electrónico"
                    />
                  </div>
                  {watchEmail && (
                    <div className="requirement-message">
                      {getEmailFirstError(watchEmail)}
                    </div>
                  )}
                </div>

                {/* Contraseña */}
                <div className="form-field">
                  <label htmlFor="password" className="input-label">Contraseña</label>
                  <div className="input-with-icon">
                    <div className="input-icon">
                      <FaLock />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        required: true,
                        minLength: 8,
                        pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/
                      })}
                      className="input-field txt"
                      placeholder="Contraseña"
                    />
                    <button type="button" onClick={togglePasswordVisibility} className="icon-button">
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {watchPassword && (
                    <div className="requirement-message">
                      {getPasswordFirstError(watchPassword)}
                    </div>
                  )}
                </div>
              </div>

              {/* Columna derecha */}
              <div className="form-column">
                {/* Apellido */}
                <div className="form-field">
                  <label htmlFor="lastName" className="input-label">Apellido</label>
                  <div className="input-with-icon">
                    <div className="input-icon">
                      <FaUser />
                    </div>
                    <input
                      type="text"
                      {...register("lastName", {
                        required: true,
                        minLength: 2,
                        maxLength: 50
                      })}
                      className="input-field txt"
                      placeholder="Apellido"
                    />
                  </div>
                  {watch("lastName") !== undefined && (
                    <div className="requirement-message">
                      {getNameFirstError(watch("lastName"), "Apellido")}
                    </div>
                  )}
                </div>

                {/* Número de teléfono */}
                <div className="form-field">
                  <label htmlFor="phoneNumber" className="input-label">Número de teléfono</label>
                  <div className="input-with-icon">
                    <div className="input-icon">
                      <FaPhone />
                    </div>
                    <input
                      type="tel"
                      {...register("phoneNumber", {
                        required: true,
                        pattern: /^\d{10}$/
                      })}
                      className="input-field txt"
                      placeholder="Número de teléfono"
                    />
                  </div>
                  {watchPhone && (
                    <div className="requirement-message">
                      {getPhoneFirstError(watchPhone)}
                    </div>
                  )}
                </div>

                {/* Confirmar Contraseña */}
                <div className="form-field">
                  <label htmlFor="confirmPassword" className="input-label">Confirmar Contraseña</label>
                  <div className="input-with-icon">
                    <div className="input-icon">
                      <FaLock />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword", {
                        required: true,
                        validate: value => value === getValues("password")
                      })}
                      className="input-field txt"
                      placeholder="Confirmar contraseña"
                    />
                    <button type="button" onClick={toggleConfirmPasswordVisibility} className="icon-button">
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {watchConfirmPassword && watchPassword !== watchConfirmPassword && (
                    <div className="requirement-message">
                      Las contraseñas no coinciden
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Palabra secreta - Fila completa */}
            <div className="form-field full-width">
              <label htmlFor="secretWord" className="input-label">Palabra secreta</label>
              <div className="input-with-icon">
                <div className="input-icon">
                  <FaKey />
                </div>
                <input
                  type="text"
                  {...register("secretWord", {
                    required: true,
                    minLength: 4
                  })}
                  className="input-field txt"
                  placeholder="Palabra secreta"
                />
              </div>
              {watch("secretWord") && watch("secretWord").length < 4 && (
                <div className="requirement-message">
                  Mínimo 4 caracteres
                </div>
              )}
            </div>

            <button type="submit" className="submit-button">Registrar</button>
          </form>

          <p className="register-footer">
            ¿Ya tienes una cuenta?
            <Link to="/login" className="link"> Inicia sesión aquí</Link>
          </p>
        </div>
      </div>
      
      {/* ToastContainer para mostrar notificaciones */}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default RegisterPage;



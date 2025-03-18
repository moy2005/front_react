import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/login.css';

function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signin, errors: signinErrors, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    await signin(data);
  });

  useEffect(() => {
    if (signinErrors.length > 0) {
      signinErrors.forEach(error => toast.error(error, { position: "top-right" }));
    }
  }, [signinErrors]);

  useEffect(() => {
    if (isAuthenticated && user) {
      toast.success("Inicio de sesión exitoso!", { position: "top-right" });
      switch (user.role) {
        case 'admin':
          navigate("/admin/profile-admin");
          break;
        case 'cliente':
          navigate("/cliente/profile");
          break;
        default:
          navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="fondo">
      <div className="login-container">
        <div className="login-box">
          <h1 className="login-title h1-form">Iniciar Sesion</h1>
          <form className="login-form" onSubmit={onSubmit}>
            <label className="input-label txt">Correo electrónico:</label>
            <div className="input-group">
              <input
                type="email"
                {...register("email", { required: "El correo es requerido" })}
                className="input-field txt"
                placeholder="Correo electrónico"
              />
              {errors.email && <p className="error-message">{errors.email.message}</p>}
            </div>

            <label className='input-label txt'>Contraseña:</label>
            <div className="input-group txt">
              <input
                type="password"
                {...register("password", { required: "La contraseña es requerida" })}
                className="input-field"
                placeholder="Contraseña"
              />
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>

            <button type="submit" className="submit-button h1-form">Iniciar Sesión</button>
          </form>

          <p className="login-footer txt">
            ¿Aún no tienes una cuenta?
            <Link to="/register" className="link"> Regístrate ahora</Link>
          </p>
          <p className="login-footer txt">
            <Link to="/forgot-password" className="link">¿Olvidaste tu contraseña?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

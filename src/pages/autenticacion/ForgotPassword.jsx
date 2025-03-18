import { useState } from 'react';
import './../../styles/forgotPassword.css';
import { toast } from 'react-toastify'; // Importar toast
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:4000/api/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        console.log(data);
        
        // Usar toast en lugar de alert
        if (data.success) {
            toast.success(data.message); // Mensaje de éxito
        } else {
            toast.error(data.message); // Mensaje de error
        }
    };

    return (
        <div className="forgot-password-container fondo">
            <div className="forgot-password-box fondo">
                <h1 className="forgot-password-title">Recuperación de contraseña</h1>
                
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Ingresa tu correo"
                        value={email}
                        className="input-field"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    
                    <button
                        type="submit"
                        className="submit-button"
                    >
                        Enviar
                    </button>
                </form>

                <a href="/login" className="back-to-login">Volver al inicio de sesión</a>
            </div>
        </div>
    );
};

export default ForgotPassword;

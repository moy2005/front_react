import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/verifyEmail.css"; 

function VerifyPage() {
    const [code, setCode] = useState("");
    const { verifyEmail } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await verifyEmail(email, code);
            if (result.success) {
                toast.success("Verificación exitosa. Redirigiendo...");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                toast.error("Código incorrecto o expirado");
            }
        } catch (error) {
            console.error("Error al verificar el código:", error);
            toast.error("Hubo un error. Inténtalo de nuevo.");
        }
    };

    return (
        <div className="verify-container">
            <div className="verify-box">
                <h2 className="verify-title h1-form">Verificar Correo</h2>
                <p className="txt">Hemos enviado un código a <strong>{email}</strong>. Ingrésalo para completar tu registro.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="input-field txt"
                        placeholder="Código de verificación"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <button type="submit" className="submit-button txt">Verificar</button>
                </form>
            </div>
        </div>
    );
}

export default VerifyPage;


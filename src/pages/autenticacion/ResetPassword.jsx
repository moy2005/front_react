import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [isValidToken, setIsValidToken] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setLoading(false);
                setIsValidToken(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:4000/api/verifyToken/${token}`);
                const data = await response.json();
                
                if (response.ok) {
                    setIsValidToken(true);
                } else {
                    toast.error(`Error de verificación: ${data.message}`);
                    setIsValidToken(false);
                }
            } catch (error) {
                toast.error('Error verificando el token');
                setIsValidToken(false);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!password) {
            toast.warn('Por favor ingrese una nueva contraseña');
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await response.json();
            
            if (response.ok) {
                toast.success(data.message);
                setTimeout(() => navigate('/login'), 2000);
            } else {
                toast.error(data.message || 'Error al restablecer la contraseña');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Hubo un problema al restablecer tu contraseña');
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Cargando...</div>;
    }

    return (
        <div className="flex h-[calc(100vh-100px)] items-center justify-center">
            {isValidToken ? (
                <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
                    <h1 className="text-center h1-form text-gray-300 text-2xl mb-4">
                        Recuperación de contraseña
                    </h1>
                    <br />
                    <form onSubmit={handleSubmit} className="w-full">
                        <input
                            type="password"
                            placeholder="Nueva contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-zinc-700 text-white tasks px-4 py-2 rounded-md mb-4 focus:outline-none focus:ring focus:ring-blue-500"
                            minLength="6"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-500 tasks text-white px-4 py-2 rounded-md transition transform hover:bg-blue-800 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring focus:ring-blue-500"
                        >
                            Restablecer
                        </button>
                    </form>
                </div>
            ) : (
                <div className="text-center">
                    <h2 className="text-gray-300 text-2xl">Token expirado o no válido</h2>
                    <button
                        onClick={() => navigate('/login')}
                        className="mt-4 bg-blue-500 px-4 py-2 rounded text-white"
                    >
                        Volver al inicio de sesión
                    </button>
                </div>
            )}
        </div>
    );
};

export default ResetPassword;
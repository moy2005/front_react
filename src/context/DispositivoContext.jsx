import { createContext, useContext, useState } from "react";
import {
    getDispositivosRequest,
    getDispositivoRequest,
    createDispositivoRequest,
    updateDispositivoRequest,
    deleteDispositivoRequest,
} from "../api/dispositivo"; 

const DispositivoContext = createContext();

// Hook personalizado para usar el contexto
export const useDispositivos = () => {
    const context = useContext(DispositivoContext);
    if (!context) {
        throw new Error("useDispositivos debe usarse dentro de un DispositivoProvider");
    }
    return context;
};

// Proveedor del contexto
export function DispositivoProvider({ children }) {
    const [dispositivos, setDispositivos] = useState([]);

    // Obtener todos los dispositivos
    const getDispositivos = async () => {
        try {
            const res = await getDispositivosRequest();
            setDispositivos(res.data);
        } catch (error) {
            console.log("Error al obtener dispositivos:", error);
        }
    };

    // Obtener un dispositivo por su ID
    const getDispositivo = async (id) => {
        try {
            const res = await getDispositivoRequest(id);
            return res.data;
        } catch (error) {
            console.log("Error al obtener el dispositivo:", error);
        }
    };

    // Crear un nuevo dispositivo
    const createDispositivo = async (dispositivo) => {
        try {
            const res = await createDispositivoRequest(dispositivo);
            if (res.status === 201) {
                setDispositivos([...dispositivos, res.data]); // Agrega el nuevo dispositivo al estado
            }
        } catch (error) {
            console.log("Error al crear el dispositivo:", error);
        }
    };

    // Actualizar un dispositivo existente
    const updateDispositivo = async (id, dispositivo) => {
        try {
            const res = await updateDispositivoRequest(id, dispositivo);
            if (res.status === 200) {
                setDispositivos(
                    dispositivos.map((d) => (d._id === id ? { ...d, ...res.data } : d)) // Actualiza el dispositivo en el estado
                );
            }
        } catch (error) {
            console.log("Error al actualizar el dispositivo:", error);
        }
    };

    // Eliminar un dispositivo
    const deleteDispositivo = async (id) => {
        try {
            const res = await deleteDispositivoRequest(id);
            if (res.status === 204) {
                setDispositivos(dispositivos.filter((dispositivo) => dispositivo._id !== id)); // Elimina el dispositivo del estado
            }
        } catch (error) {
            console.log("Error al eliminar el dispositivo:", error);
        }
    };

    return (
        <DispositivoContext.Provider
            value={{
                dispositivos,
                getDispositivos,
                getDispositivo,
                createDispositivo,
                updateDispositivo,
                deleteDispositivo,
            }}
        >
            {children}
        </DispositivoContext.Provider>
    );
}
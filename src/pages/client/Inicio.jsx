import { PlusOutlined, DesktopOutlined, MobileOutlined, BulbOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { Card } from 'antd';
import ModalAddDevice from '../../components/ModalAddDevice';
import { useUser } from '../../hooks/useUsers';
import { useNavigate } from 'react-router-dom';
import '../../styles/inicio.css';

const Inicio = () => {
    const { dispositivos, loading } = useUser();
    const [modal, setModal] = useState(false);
    const navigation = useNavigate();
    
    if (loading) {
        return <p className='loading'>Cargando dispositivos...</p>;
    }
    
    // Función para determinar el icono según el tipo de dispositivo
    const getIcon = (tipo) => {
        // Aquí podríamos agregar lógica para inferir el tipo basado en el nombre
        // o añadir un campo tipo por defecto
        const deviceType = tipo || 'Ordenador';
        
        switch (deviceType) {
            case 'Ordenador':
                return <DesktopOutlined className="icon" />;
            case 'Móvil':
                return <MobileOutlined className="icon" />;
            case 'Luz':
                return <BulbOutlined className="icon" />;
            default:
                return <DesktopOutlined className="icon" />;
        }
    };

    console.log(dispositivos);
    
    
    return (
        <div className='inicio-container'>
            <div className="grid-container">
                {dispositivos.map((dispositivo) => (
                    <Card 
                    key={dispositivo._id} 
                    hoverable 
                    className="device-card" 
                    onClick={() => { navigation(`/dispositivo/${dispositivo.macAddress}`) }}
                >
                    {getIcon(dispositivo.tipo)}
                    <h3 className="device-title">{dispositivo.name}</h3>
                    <p className="device-type">{dispositivo.tipo || 'Dispositivo'}</p>
                </Card>
                ))}
                <Card hoverable className="add-card" onClick={() => setModal(true)}>
                    <PlusOutlined className="icon" />
                    <h3 className="device-title">Agregar</h3>
                </Card>
            </div>
            {modal && (
                <ModalAddDevice setModal={setModal} />
            )}
        </div>
    );
};

export default Inicio;


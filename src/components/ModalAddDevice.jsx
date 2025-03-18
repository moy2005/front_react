import { Form, Input, Button } from 'antd';
import { useAuth } from '../context/AuthContext';
import { useDispositivos } from '../hooks/useDispositivos';
//import './ModalAddDevice.css';

const ModalAddDevice = ({ setModal }) => {

    const { user } = useAuth();
    const { asignarDispositivo, loading } = useDispositivos();

    
    const handleAddDevice = async (values) => {
        if (!user || !user.id) return; // Check if user exists
        
        const deviceData = {
            macAddress: values.macAddress,
            name: values.nombrePersonalizado  // Map to the correct field name
        };
    
        await asignarDispositivo(deviceData);
        setModal(false); // Close modal if successful
    };

    return (
        <div className='modal-container' onClick={() => setModal(false)}> {/* Cierra al hacer clic fuera */}
            
            <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Evita cerrar si se hace clic dentro */}
                
                <h2>Agregar Dispositivo</h2>
                
                <Form onFinish={handleAddDevice} layout="vertical">
                    <Form.Item
                        name="nombrePersonalizado"
                        label="Nombre del dispositivo"
                        rules={[{ required: true, message: 'Por favor ingrese un nombre' }]}
                    >
                        <Input size="large" />
                    </Form.Item>

                    <Form.Item
                        name="macAddress"
                        label="Código del dispositivo"
                        rules={[{ required: true, message: 'El código del dispositivo' }]}
                    >
                        <Input size="large" />
                    </Form.Item>

                    <div className="modal-buttons">
                        <Button type="primary" htmlType="submit" size="large" block loading={loading}>
                            {loading ? "Asignando..." : "Agregar Dispositivo"}
                        </Button>
                        <Button onClick={() => setModal(false)} size="large" block>
                            Cancelar
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default ModalAddDevice;

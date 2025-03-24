import { Form, Input, Button } from 'antd'; 
import { useAuth } from '../context/AuthContext'; 
import { useDispositivos } from '../hooks/useDispositivos'; 

// Estilos CSS internos
const styles = `
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal-content {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    width: 100%;
    max-width: 450px;
    padding: 32px;
    position: relative;
    transform-origin: center;
    animation: scaleIn 0.3s ease-out;
  }

  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  .modal-header {
    margin-bottom: 24px;
    text-align: center;
    position: relative;
  }

  .modal-header h2 {
    color: #2E7D32; /* Verde oscuro */
    font-size: 24px;
    font-weight: 600;
    margin: 0;
  }

  .modal-header::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background-color: #4CAF50; /* Verde medio */
    margin: 12px auto 0;
  }

  .modal-form .ant-form-item-label > label {
    color: #2E7D32; /* Verde oscuro */
    font-weight: 500;
  }

  .modal-form .ant-input {
    border: 1px solid #E0E0E0;
    border-radius: 6px;
    padding: 12px 16px;
    height: auto;
    transition: all 0.3s ease;
  }

  .modal-form .ant-input:focus,
  .modal-form .ant-input:hover {
    border-color: #4CAF50; /* Verde medio */
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }

  .modal-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 24px;
  }

  .btn-primary {
    background-color: #2E7D32; /* Verde oscuro */
    border: none;
    border-radius: 6px;
    color: white;
    height: 48px;
    font-size: 16px;
    font-weight: 500;
    box-shadow: 0 3px 6px rgba(46, 125, 50, 0.2);
    transition: all 0.3s ease;
  }

  .btn-primary:hover, 
  .btn-primary:focus {
    background-color: #388E3C; /* Verde más claro en hover */
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(46, 125, 50, 0.3);
  }

  .btn-primary:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(46, 125, 50, 0.3);
  }

  .btn-secondary {
    background-color: white;
    border: 1px solid #E0E0E0;
    border-radius: 6px;
    color: #333333;
    height: 48px;
    font-size: 16px;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .btn-secondary:hover, 
  .btn-secondary:focus {
    border-color: #4CAF50; /* Verde medio */
    color: #2E7D32; /* Verde oscuro */
  }

  .loading-spinner {
    margin-right: 8px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
    display: inline-block;
    vertical-align: middle;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

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
        <>
            <style>{styles}</style>
            <div className='modal-overlay' onClick={() => setModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Agregar Dispositivo</h2>
                    </div>
                    
                    <Form 
                        onFinish={handleAddDevice} 
                        layout="vertical"
                        className="modal-form"
                    >
                        <Form.Item
                            name="nombrePersonalizado"
                            label="Nombre del dispositivo"
                            rules={[{ required: true, message: 'Por favor ingrese un nombre' }]}
                        >
                            <Input />
                        </Form.Item>
                        
                        <Form.Item
                            name="macAddress"
                            label="Código del dispositivo"
                            rules={[{ required: true, message: 'El código del dispositivo es requerido' }]}
                        >
                            <Input />
                        </Form.Item>
                        
                        <div className="modal-buttons">
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                className="btn-primary" 
                                block 
                                loading={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        Asignando...
                                    </>
                                ) : "Agregar Dispositivo"}
                            </Button>
                            <Button 
                                onClick={() => setModal(false)} 
                                className="btn-secondary" 
                                block
                            >
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default ModalAddDevice;
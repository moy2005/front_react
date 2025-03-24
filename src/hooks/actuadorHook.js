// Hook control actuadores
export const controlActuatorRequest = async (macAddress, actuatorType, command) => {
    try {
      const response = await api.post("/actuadores/control-actuador", {
        macAddress,
        actuatorType,
        command,
      });
      return response.data;
    } catch (error) {
      console.error("Error al controlar el actuador:", error);
      throw error;
    }
  };
  
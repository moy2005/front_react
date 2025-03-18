import axios from "./axios"; // Importa la instancia configurada de axios


export const getDispositivosRequest = () => axios.get("/dispositivos");

export const getDispositivoRequest = (id) => axios.get(`/dispositivos/${id}`);


export const createDispositivoRequest = (dispositivo) =>
    axios.post("/dispositivos", dispositivo);

export const updateDispositivoRequest = (id, dispositivo) =>
    axios.put(`/dispositivos/${id}`, dispositivo);

export const deleteDispositivoRequest = (id) =>
    axios.delete(`/dispositivos/${id}`);


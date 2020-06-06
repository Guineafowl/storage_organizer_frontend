import axios from "axios";

const hostLocation = () => {
    const location = window.location.toString();
    if (location.includes('localhost')) {
        return 'localhost';
    } else if (location.includes('89.73.105.93')) {
        return '89.73.105.93';
    } else if (location.includes('192.168.0.2')) {
        return '192.168.0.2';
    }
};

const baseUrl = `http://${hostLocation()}:9095`;
const apiUrl = `${baseUrl}/api`;

export const fetchRooms = () => {
    return axios.get(`${apiUrl}/rooms`)
        .then(response => response.data);
};

export const changeProductName = (id, name) => {
    return axios.put(`${apiUrl}/product/${id}/name`, {name});
};

export const changeStorageName = (id, name) => {
    return axios.put(`${apiUrl}/storage/${id}/name`, {name});
};

export const deleteProduct = (id) => {
    return axios.delete(`${apiUrl}/product/${id}`);
};

export const addRoom = (name, photoId) => {
    return axios.post(`${apiUrl}/room`, {photoId, name});
};

export const deleteRoom = (id) => {
    return axios.delete(`${apiUrl}/room/${id}`)
};

export const addRoomStorage = (id, name, photoId) => {
    return axios.post(`${apiUrl}/room/${id}/storage`, {name, photoId});
};

export const addStorageChild = (id, name, photoId) => {
    return axios.post(`${apiUrl}/storage/${id}/storages`, {name, photoId});
};

export const deleteStorage = (id) => {
    return axios.delete(`${apiUrl}/storage/${id}`);
};

export const addProduct = (id, product) => {
    return axios.post(`${apiUrl}/storage/${id}/products`, product);
};

export const uploadPhoto = (file) => {
    const data = new FormData();
    data.append('file', file, file.name);
    return axios.post(`${apiUrl}/photo`, data)
        .then(response => response.data);
};

export const changeProductQuantity = (id, quantity, capacity) => {
    return axios.put(`${apiUrl}/product/${id}/quantity`, {quantity, capacity})
};

export const image = (url) => `${baseUrl}/static/${url}`;

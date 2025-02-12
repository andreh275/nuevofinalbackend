import apiClient from '../plugins/axios.js';

export async function getData(url) {
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Error en la petición GET:', error);
    throw error;
  }
}

export async function postData(url, data) {
  try {
    console.log('Enviando datos:', data);  // Verifica los datos enviados
    const response = await apiClient.post(url, data);
    console.log('Respuesta de la API:', response.data);  // Verifica la respuesta de la API
    return response.data;
  } catch (error) {
    console.error('Error en la petición POST:', error);
    throw error;
  }
}


export async function putData(url, data) {
  try {
    const response = await apiClient.put(url, data);
    return response.data;
  } catch (error) {
    console.error('Error en la petición PUT:', error);
    throw error;
  }
}


export async function deleteData(url, token) {
  try {
    const response = await apiClient.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error en la petición DELETE:', error);
    throw error;
  }
}
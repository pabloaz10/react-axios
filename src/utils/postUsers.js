import api from './api';

export default async function postUsers(userData) {
    try {
        const response = await api.post('/users', userData);
        console.log('Usuário criado:', response.data);
        return response;
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
    }
}

import api from './api';

export default async function updateUser(userId, userData) {
    try {
        const response = await api.put(`/users/${userId}`, userData);
        console.log('Usuário atualizado:', response.data);
        return response;
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        throw error;
    }
}
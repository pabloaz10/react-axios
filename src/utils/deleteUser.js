import api from './api';

export default async function deleteUser(userId) {
    try {
        const response = await api.delete(`/users/${userId}`);
        console.log('Usuário removido com sucesso');
        return response;
    } catch (error) {
        console.error('Erro ao remover usuário:', error);
        throw error;
    }
}
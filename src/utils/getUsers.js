import api from './api';

export default async function getUsers() {
    try {
        const response = await api.get('/users');
        console.log('Usuário:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        throw error;
    }
};
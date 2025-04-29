import { useEffect, useState } from 'react';
import getUsers from './utils/getUsers';
import postUsers from './utils/postUsers';
import updateUser from './utils/updateUser';
import deleteUser from './utils/deleteUser';

function App() {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    status: '',
  });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setError('Falha ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (editingUser) {
        // Atualizar usuário existente
        const response = await updateUser(editingUser.id, formData);
        console.log('Usuário atualizado:', response.data);

        // Atualizar lista de usuários
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === editingUser.id ? response.data : user
          )
        );

        // Limpar modo de edição
        setEditingUser(null);
      } else {
        // Criar novo usuário
        const response = await postUsers(formData);
        console.log('Usuário criado:', response.data);

        // Adicionar à lista
        setUsers(prevUsers => [...prevUsers, response.data]);
      }

      // Limpar formulário
      setFormData({
        name: '',
        email: '',
        password: '',
        status: ''
      });
    } catch (error) {
      console.error('Erro na operação:', error);
      setError('Falha na operação');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    // Preencher formulário com dados do usuário
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password || '',
      status: user.status
    });
    setEditingUser(user);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        setLoading(true);
        await deleteUser(userId);

        // Remover usuário da lista
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));

      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        setError('Falha ao excluir usuário');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div>
        <h1>Usuários:</h1>
        {loading && <p>Carregando...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {users ? (
          Array.isArray(users) ? (
            <ul>
              {users.map((user, index) => (
                <li key={user.id || index}>
                  {user.name} {user.email}
                  <button onClick={() => handleEdit(user)}>Editar</button>
                  <button onClick={() => handleDelete(user.id)}>Excluir</button>
                </li>
              ))}
            </ul>
          ) : (
            <div>
              {users.name} {users.email}
            </div>
          )
        ) : (
          <p>Nenhum usuário encontrado</p>
        )}
      </div>
      <div>
        <h2>{editingUser ? 'Editar Usuário' : 'Criar Usuário'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Nome"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="text"
            name="status"
            placeholder="Status"
            value={formData.status}
            onChange={handleChange}
          />
          <button type="submit">
            {editingUser ? 'Atualizar' : 'Criar'}
          </button>
          {editingUser && (
            <button type="button" onClick={() => {
              setEditingUser(null);
              setFormData({
                name: '',
                email: '',
                password: '',
                status: ''
              });
            }}>
              Cancelar
            </button>
          )}
        </form>
      </div>
    </>
  );
}

export default App;
import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
});


export class UserService {
    public ListAll() {
        return axiosInstance.get('/v1/users');
    }

    public getByID(id: number) {
        return axiosInstance.get(`/v1/users/${id}`);
    }

    public Create(user: Projeto.Usuario) {
        return axiosInstance.post('/v1/users', user);
    }

    public Update(user: Projeto.Usuario) {
        return axiosInstance.put('/v1/users/' + user.id, user);
    }

    public Delete(id: number) {
        return axiosInstance.delete(`/v1/users/${id}/delete`);
    }
}

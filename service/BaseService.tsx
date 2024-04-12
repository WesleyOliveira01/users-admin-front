import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});


export class BaseService {
    url:string;

    constructor(url:String) {
        this.url = url;
    }

    public ListAll() {
        return axiosInstance.get(this.url);
    }

    public getByID(id: number) {
        return axiosInstance.get(`${this.url}/${id}`);
    }

    public Create(user: any) {
        return axiosInstance.post(this.url, user);
    }

    public Update(user: any) {
        return axiosInstance.put(`${this.url}/${user.id}`, user);
    }

    public Delete(id: number) {
        return axiosInstance.delete(`/v1/users/${id}/delete`);
    }
}

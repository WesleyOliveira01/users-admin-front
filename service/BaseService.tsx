import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});


export class BaseService {
    url:string;

    constructor(url:string) {
        this.url = url;
    }

    public ListAll() {
        return axiosInstance.get(this.url);
    }

    public getByID(id: number) {
        return axiosInstance.get(`${this.url}/${id}`);
    }

    public Create(item: any) {
        return axiosInstance.post(this.url, item);
    }

    public Update(item: any) {
        return axiosInstance.put(`${this.url}/${item.id}`, item);
    }

    public Delete(id: number) {
        return axiosInstance.delete(`${this.url}/${id}/delete`);
    }
}

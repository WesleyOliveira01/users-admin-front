declare namespace Projeto{
import { name } from './../.next/server/app/(main)/page';
    type Usuario = {
        id?: number;
        name: string;
        email:string;
        login:string;
        password:string;
    }

    type Recurso = {
        id?:number;
        name:string;
        key:string;
    }

    type Perfil = {
        id?:number;
        descricao:string;
    }
}

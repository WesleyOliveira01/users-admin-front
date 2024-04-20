import { BaseService } from './BaseService';

export class PerfilService extends BaseService {
    constructor() {
        super('/v1/perfil');
    }
}

import { BaseService } from './BaseService';

export class UserService extends BaseService {
   constructor(){
    super('/v1/users');
   }
}

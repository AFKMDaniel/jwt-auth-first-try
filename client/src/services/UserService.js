import $api from "../http";

export default class UserService {
    static async getAllUsers(){
        return $api.get('/users')
    }
}
import axios from 'axios';
import {makeAutoObservable} from 'mobx';
import AuthService from '../services/AuthService';
import { API_URL } from '../http';

class Store {
    user = {};
    isAuth = false;
    isLoading = false;

    constructor(){
        makeAutoObservable(this);
    }

    setAuth(bool){
        this.isAuth = bool;
    }

    setUser(user){
        this.user = user;
    }

    setLoading(bool){
        this.isLoading = bool;
    }

    async login(email,password){
        try {
            const response = await AuthService.login(email,password);
            localStorage.setItem('token',response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            console.log(response);
        } catch (error) {
            console.log(error.response?.data?.message);
        }
    }

    async registration(email,password){
        try {
            const response = await AuthService.registration(email,password);
            localStorage.setItem('token',response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            console.log(response);
        } catch (error) {
            console.log(error.response?.data?.message);
        }
    }

    async logout(){
        try {
            await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({});
        } catch (error) {
            console.log(error.response?.data?.message);
        }
    }

    async checkAuth(){
        this.setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/refresh`,{withCredentials:true});
            console.log(response);
            localStorage.setItem('token',response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (error) {
            console.log(error.response?.data?.message);
        } finally {
            this.setLoading(false)
        }
    }
}

export default new Store();
import axios from 'axios';

export const API_URL = 'http://localhost:7000/api';

const $api = axios.create({
    withCredentials:true,
    baseURL: API_URL
});

$api.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config
})

$api.interceptors.response.use(config => config, async(error) => {
    const originalRequest = error.config;
    if(error.response.status == 401 && originalRequest && !originalRequest._isRetry){
            originalRequest._isRetry = true;
        try {
            const response = await axios.get(`${API_URL}/refresh`,{withCredentials:true});
            localStorage.setItem('token',response.data.accessToken);
            $api.request(originalRequest);
        } catch (e) {
            console.log('Не авторизован')
        }
    }
    throw error
})

export default $api;
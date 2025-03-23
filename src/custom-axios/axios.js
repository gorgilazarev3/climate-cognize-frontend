import axios from 'axios'

import { LocalStorageKeys } from '../constants/localStorageKeys';
import { AuthRoutes } from '../constants/routes';

const instance = axios.create({
    baseURL: "http://localhost:9090/api",
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
        'Authorization': localStorage.getItem(LocalStorageKeys.JWT),
        'Access-Control-Allow-Credentials': 'true'
    }
});

instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem(LocalStorageKeys.JWT);
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    error => {
        if (error.response.status === 403) {
            localStorage.removeItem(LocalStorageKeys.JWT);
            window.location.href = AuthRoutes.LOGIN;
        }
        return Promise.reject(error);
    }
);


export default instance;
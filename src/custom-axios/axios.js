import axios from 'axios'

const instance = axios.create({
    baseURL: "http://localhost:9090/api",
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
        'Authorization': localStorage.getItem("JWT")
    }
});

instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem("JWT");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    error => {
        if (error.response.status === 403) {
            localStorage.removeItem("JWT");
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


export default instance;
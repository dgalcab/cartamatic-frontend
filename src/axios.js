import axios from 'axios';

// Crear una instancia de Axios
const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api',  // URL base de tu API en Laravel
    withCredentials: false,  // Para evitar problemas de credenciales innecesarias en el login
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Interceptor para añadir el token Bearer solo a rutas protegidas
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('auth_token');  // Recuperamos el token almacenado

    // Evitar añadir el token en rutas públicas como login o register
    const isPublicRoute = config.url.includes('/login') || config.url.includes('/register') || config.url.includes('/test-pusher');

    if (!isPublicRoute && token) {
        config.headers['Authorization'] = `Bearer ${token}`;  // Añadimos el token Bearer solo a rutas protegidas
    } else {
        console.log('Ruta pública, no se añade token');
    }

    return config;
}, error => {
    return Promise.reject(error);
});

export default apiClient;

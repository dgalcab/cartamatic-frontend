import { createApp } from 'vue'
import router from './router';
import './style.css'
import App from './App.vue'
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import 'leaflet/dist/leaflet.css';
import apiClient from '/src/axios';
import 'flatpickr/dist/flatpickr.min.css';




const app = createApp(App);

// Añadir apiClient a todas las instancias de componentes como $axios
app.config.globalProperties.$axios = apiClient;

app.use(router).mount('#app');
import { createRouter, createWebHistory } from "vue-router";
import Home from '/src/views/Home.vue';
import Login from '/src/views/Login.vue';
import Register from '/src/views/Register.vue';
import Restaurants from '/src/views/Restaurants.vue';
import RegisterSuccess from '/src/views/RegisterSuccess.vue';
import CreateRestaurant from '/src/views/CreateRestaurant.vue';
import UpdateRestaurant from '/src/views/UpdateRestaurant.vue';
import RestaurantView from '../views/RestaurantView.vue';
import CreateCategory from '/src/views/CreateCategory.vue';
import CreateItem from '/src/views/CreateItem.vue';
import UpdateCategory from '/src/views/UpdateCategory.vue';
import UpdateItem from '/src/views/UpdateItem.vue';


const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
    { path: '/restaurants', name: 'Restaurants', component: Restaurants },
    { path: '/register-success', name: 'RegisterSuccess', component: RegisterSuccess },
    { path: '/create-restaurant', name: 'CreateRestaurant', component: CreateRestaurant },
    { path: '/restaurants/:id/edit', name: 'UpdateRestaurant', component: UpdateRestaurant, props: true },
    { path: '/restaurants/:id', name: 'RestaurantView', component: RestaurantView, props: true },
    { path: '/restaurants/:restaurantId/categories/create', name: 'CreateCategory', component: CreateCategory, props: true },
    { path: '/restaurants/:restaurantId/items/create', name: 'CreateItem', component: CreateItem, props: true },
    { path: '/restaurants/:restaurantId/categories/:categoryId/edit', name: 'UpdateCategory', component: UpdateCategory, props: true },
    { path: '/restaurants/:restaurantId/categories/:categoryId/items/:itemId/edit', name: 'UpdateItem', component: UpdateItem, props: true },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Asegúrate de exportar el router como default
export default router;

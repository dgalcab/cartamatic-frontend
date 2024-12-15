<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <Header />

    <!-- Título y botón para crear restaurante (solo para usuarios logueados) -->
    <div class="container mx-auto py-8 mt-20">
      <div class="flex justify-between items-center">
        <h1 class="text-4xl font-bold">
          {{ isAuthenticated ? 'Mis Restaurantes' : 'Restaurantes' }}
        </h1>

        <!-- Botón para crear restaurante (solo si está autenticado) -->
        <router-link v-if="isAuthenticated" to="/create-restaurant">
          <button class="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-opacity-80">
            Crear Restaurante
          </button>
        </router-link>
      </div>

      <!-- Grid de restaurantes -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <RestaurantCard
            v-for="restaurant in filteredRestaurants"
            :key="restaurant.id"
            :id="restaurant.id"
            :name="restaurant.name"
            :description="restaurant.description"
            :location="restaurant.location"
            :phone="restaurant.phone"
            :email="restaurant.email"
            :website_url="restaurant.website_url"
            :logo_url="restaurant.logo_url"
            :image_url="restaurant.image_url"
            :user_id="restaurant.user_id"
            :current_user_id="userId"
            :isAuthenticated="isAuthenticated"
            @delete-restaurant="deleteRestaurant"
            @edit-restaurant="editRestaurant"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Header from '/src/components/Header.vue';
import RestaurantCard from '/src/components/RestaurantCard.vue';
import apiClient from '/src/axios.js';

export default {
  name: 'Restaurants',
  components: {
    Header,
    RestaurantCard,
  },
  data() {
    return {
      restaurants: [],
      isAuthenticated: false,
      userId: null, // Guardar el ID del usuario autenticado
    };
  },
  computed: {
    filteredRestaurants() {
      console.log('Filtrando restaurantes por user_id:', this.userId);
      // Si el usuario está autenticado, mostrar solo los restaurantes creados por él
      if (this.isAuthenticated && this.userId !== null) {
        return this.restaurants.filter(restaurant => restaurant.user_id === this.userId);
      }
      // Si no está autenticado, mostrar todos los restaurantes
      return this.restaurants;
    },
  },
  mounted() {
    this.checkAuthStatus();
    this.fetchRestaurants();
  },
  methods: {
    async fetchRestaurants() {
      try {
        const response = await apiClient.get('/restaurants');
        this.restaurants = response.data;
      } catch (error) {
        console.error('Error al obtener los restaurantes:', error);
      }
    },
    checkAuthStatus() {
      const token = localStorage.getItem('auth_token');
      const userId = localStorage.getItem('user_id');
      this.isAuthenticated = !!token && !!userId;
      this.userId = userId ? parseInt(userId) : null;

      console.log('Estado de autenticación:', this.isAuthenticated);
      console.log('ID del usuario autenticado:', this.userId);
    },
    getRestaurantImage(imageUrl) {
      return imageUrl ? `http://localhost:8000/storage/${imageUrl}` : 'path/to/default/image.jpg'; // Imagen por defecto si no hay image_url
    },
    async deleteRestaurant(id) {
      try {
        await apiClient.delete(`/restaurants/${id}`);
        this.restaurants = this.restaurants.filter(r => r.id !== id); // Actualizamos la lista sin el restaurante eliminado
      } catch (error) {
        console.error('Error al eliminar el restaurante:', error);
      }
    },
    editRestaurant(id) {
      // Redirigir a la vista de edición de restaurante con el ID del restaurante
      this.$router.push({ name: 'UpdateRestaurant', params: { id } });
    },
  },
};
</script>

<style scoped>
/* Añadir estilos adicionales si lo necesitas */
</style>

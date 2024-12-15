<template>
  <div class="min-h-screen flex flex-col">
    <Header />

    <!-- Hero Section -->
    <HeroSection />

    <!-- Título de "Mis Restaurantes" -->
    <h2 class="text-4xl font-bold text-center my-10">Restaurantes</h2>

    <!-- Carrusel de restaurantes -->
    <RestaurantCarousel
        :restaurants="restaurants"
        :userId="userId"
        :isAuthenticated="isAuthenticated"
    />
  </div>
</template>

<script>
import Header from '/src/components/Header.vue';
import HeroSection from '/src/components/HeroSection.vue';
import RestaurantCarousel from '/src/components/RestaurantCarousel.vue';
import apiClient from '/src/axios.js';

export default {
  components: {
    Header,
    HeroSection,
    RestaurantCarousel,
  },
  data() {
    return {
      restaurants: [], // Aquí se almacenarán los restaurantes obtenidos del API
      userId: 1, // El ID del usuario autenticado
      isAuthenticated: true, // Aquí manejamos si el usuario está autenticado
    };
  },
  mounted() {
    this.fetchRestaurants();
  },
  methods: {
    async fetchRestaurants() {
      try {
        const response = await apiClient.get('/restaurants');
        this.restaurants = response.data; // Guardamos los restaurantes en el estado
      } catch (error) {
        console.error('Error al obtener los restaurantes:', error);
      }
    },
  },
};
</script>

<style scoped>
h2 {
  margin-top: 50px;
}
</style>

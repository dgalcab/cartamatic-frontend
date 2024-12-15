<template>
  <div class="carousel-container overflow-hidden">
    <div class="carousel flex space-x-4">
      <!-- Mostrar los restaurantes -->
      <div v-for="(restaurant, index) in paddedRestaurants" :key="index" class="restaurant-card-wrapper">
        <RestaurantCard
            v-if="restaurant"
            :id="restaurant.id"
            :name="restaurant.name"
            :description="restaurant.description"
            :location="restaurant.location"
            :phone="restaurant.phone"
            :email="restaurant.email"
            :website_url="restaurant.website_url"
            :image_url="restaurant.image_url"
            :logo_url="restaurant.logo_url"
            :user_id="restaurant.user_id"
            :current_user_id="userId"
            :isAuthenticated="isAuthenticated"
        >
          <!-- Botón Ver Restaurante siempre visible -->
          <div class="w-full flex justify-center mt-4">
            <router-link
                :to="`/restaurants/${restaurant.id}`"
                class="inline-block w-full text-center py-2 px-4 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary-dark transition-colors duration-300"
            >
              Ver Restaurante
            </router-link>
          </div>
        </RestaurantCard>
      </div>
    </div>
  </div>
</template>

<script>
import RestaurantCard from './RestaurantCard.vue';

export default {
  name: "RestaurantCarousel",
  components: { RestaurantCard },
  props: {
    restaurants: {
      type: Array,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
    isAuthenticated: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    // Siempre tendremos 5 elementos en el carrusel
    paddedRestaurants() {
      const blankSpaces = 5 - this.restaurants.length;
      const paddedArray = [...this.restaurants];

      // Añadimos "null" para las tarjetas en blanco si faltan restaurantes
      for (let i = 0; i < blankSpaces; i++) {
        paddedArray.push(null);
      }

      return paddedArray;
    },
  },
};
</script>

<style scoped>
.carousel-container {
  width: 100%;
}

.carousel {
  display: flex;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: white white;
}

.carousel::-webkit-scrollbar {
  height: 8px;
}

.carousel::-webkit-scrollbar-thumb {
  background-color: white;
  border-radius: 10px;
}

.carousel::-webkit-scrollbar-track {
  background-color: white;
}

.restaurant-card-wrapper {
  flex: 1 0 auto;
  min-width: 20%;
  max-width: 20%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}

@media (max-width: 768px) {
  .restaurant-card-wrapper {
    min-width: 100%;
    max-width: 100%;
  }
}

/* Estilo del botón Ver Restaurante */
.bg-secondary {
  background-color: #d47e2f; /* Color secundario */
}

.bg-secondary-dark {
  background-color: #bf6e1a; /* Color secundario más oscuro para hover */
}
</style>

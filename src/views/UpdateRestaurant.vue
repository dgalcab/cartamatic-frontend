<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <div class="container mx-auto py-12">
      <h1 class="text-3xl font-bold mb-6">Actualizar Restaurante</h1>

      <form @submit.prevent="updateRestaurant" enctype="multipart/form-data">
        <!-- Nombre del restaurante -->
        <div class="mb-4">
          <label for="name" class="block text-gray-700">Nombre del Restaurante</label>
          <input
              v-model="restaurant.name"
              type="text"
              id="name"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-secondary"
              required
          />
        </div>

        <!-- Descripción del restaurante -->
        <div class="mb-4">
          <label for="description" class="block text-gray-700">Descripción</label>
          <textarea
              v-model="restaurant.description"
              id="description"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-secondary"
          ></textarea>
        </div>

        <!-- Ubicación -->
        <div class="mb-4">
          <label for="location" class="block text-gray-700">Ubicación</label>
          <input
              v-model="restaurant.location"
              type="text"
              id="location"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-secondary"
              required
          />
        </div>

        <!-- Teléfono -->
        <div class="mb-4">
          <label for="phone" class="block text-gray-700">Teléfono</label>
          <input
              v-model="restaurant.phone"
              type="tel"
              id="phone"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-secondary"
              required
          />
        </div>

        <!-- Correo Electrónico -->
        <div class="mb-4">
          <label for="email" class="block text-gray-700">Correo Electrónico</label>
          <input
              v-model="restaurant.email"
              type="email"
              id="email"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-secondary"
              required
          />
        </div>

        <!-- URL del sitio web -->
        <div class="mb-4">
          <label for="website_url" class="block text-gray-700">URL del Sitio Web</label>
          <input
              v-model="restaurant.website_url"
              type="url"
              id="website_url"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-secondary"
          />
        </div>

        <!-- Logo del restaurante -->
        <div class="mb-4">
          <label for="logo" class="block text-gray-700">Logo del Restaurante</label>
          <input @change="onLogoChange" type="file" id="logo" class="w-full px-4 py-2 border rounded-lg" accept="image/*" />
        </div>

        <!-- Imagen principal del restaurante -->
        <div class="mb-4">
          <label for="image" class="block text-gray-700">Imagen Principal del Restaurante</label>
          <input @change="onImageChange" type="file" id="image" class="w-full px-4 py-2 border rounded-lg" accept="image/*" />
        </div>

        <!-- Horarios del restaurante -->
        <h2 class="text-2xl font-bold mb-4">Horarios del Restaurante</h2>
        <div v-for="(schedule, index) in schedules" :key="index" class="mb-4">
          <label class="block text-gray-700">{{ daysOfWeek[index] }}</label>
          <div class="flex items-center space-x-2">
            <input
                type="time"
                v-model="schedule.open_time"
                :disabled="schedule.closed"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-secondary"
            />
            <span>-</span>
            <input
                type="time"
                v-model="schedule.close_time"
                :disabled="schedule.closed"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-secondary"
            />
            <label class="ml-4">
              <input type="checkbox" v-model="schedule.closed" />
              Cerrado
            </label>
          </div>
        </div>

        <!-- Botón para enviar el formulario -->
        <button
            type="submit"
            class="w-full bg-secondary text-white py-2 rounded-lg hover:bg-opacity-80"
        >
          Actualizar Restaurante
        </button>

        <!-- Mensaje de error (si existe) -->
        <p v-if="errorMessage" class="text-red-500 text-center mt-4">{{ errorMessage }}</p>
        <p v-if="successMessage" class="text-green-500 text-center mt-4">{{ successMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import apiClient from '/src/axios.js'; // Importamos Axios

export default {
  data() {
    return {
      restaurant: {
        name: '',
        description: '',
        location: '',
        phone: '',
        email: '',
        website_url: '',
      },
      schedules: [],  // Almacenamos los horarios aquí
      logo: null,
      image: null,
      errorMessage: '',
      successMessage: '',
      daysOfWeek: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],  // Días de la semana
    };
  },
  mounted() {
    this.fetchRestaurant();
    this.fetchSchedules();  // Cargar los horarios actuales del restaurante
  },
  methods: {
    async fetchRestaurant() {
      try {
        const response = await apiClient.get(`/restaurants/${this.$route.params.id}`);
        this.restaurant = response.data;
        console.log('Restaurante cargado:', this.restaurant);
      } catch (error) {
        console.error('Error al cargar el restaurante:', error);
        this.errorMessage = 'Error al cargar los datos del restaurante.';
      }
    },
    async fetchSchedules() {
      try {
        const response = await apiClient.get(`/restaurants/${this.$route.params.id}/schedules`);
        this.schedules = response.data.map(schedule => ({
          ...schedule,
          closed: schedule.open_time === null && schedule.close_time === null,
          open_time: schedule.open_time || '',
          close_time: schedule.close_time || '',
        }));
        console.log('Horarios cargados:', this.schedules);

        // Si no hay horarios, inicializar los 7 días de la semana
        if (this.schedules.length === 0) {
          this.schedules = Array.from({ length: 7 }, (_, i) => ({
            day_of_week: i,
            open_time: '',
            close_time: '',
            closed: true,
          }));
        }
      } catch (error) {
        console.error('Error al cargar los horarios:', error);
        this.errorMessage = 'Error al cargar los horarios del restaurante.';
      }
    },
    onLogoChange(event) {
      this.logo = event.target.files[0];
    },
    onImageChange(event) {
      this.image = event.target.files[0];
    },
    async updateRestaurant() {
      try {
        const formData = new FormData();

        // Añadir datos del restaurante
        formData.append('name', this.restaurant.name);
        formData.append('description', this.restaurant.description);
        formData.append('location', this.restaurant.location);
        formData.append('phone', this.restaurant.phone);
        formData.append('email', this.restaurant.email);
        formData.append('website_url', this.restaurant.website_url);

        // Añadir logo si está presente
        if (this.logo) {
          formData.append('logo', this.logo);
        }

        // Añadir imagen principal si está presente
        if (this.image) {
          formData.append('image', this.image);
        }

        // Actualizar el restaurante
        const restaurantResponse = await apiClient.put(`/restaurants/${this.$route.params.id}`, formData);
        console.log('Restaurante actualizado:', restaurantResponse.data);

        // Convertir horarios a formato correcto (HH:mm)
        const formattedSchedules = this.schedules.map(schedule => ({
          day_of_week: schedule.day_of_week,
          open_time: schedule.closed ? null : schedule.open_time,
          close_time: schedule.closed ? null : schedule.close_time,
        }));

        // Actualizar los horarios
        const schedulesResponse = await apiClient.post(`/restaurants/${this.$route.params.id}/schedules`, {
          schedules: formattedSchedules,
        });

        console.log('Horarios actualizados:', schedulesResponse.data);

        // Redirigir a la página de restaurantes
        this.$router.push('/restaurants');
      } catch (error) {
        console.error('Error al actualizar el restaurante:', error);
        this.errorMessage = 'Error al actualizar el restaurante. Por favor, verifica los datos.';
      }
    },
  },
};
</script>

<style scoped>
/* Añadir estilos personalizados si es necesario */
</style>

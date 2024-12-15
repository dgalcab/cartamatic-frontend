<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <div class="container mx-auto py-12">
      <!-- Indicador de progreso -->
      <div class="progress-indicator flex justify-center mb-6">
        <div :class="step === 1 ? 'bg-blue-500' : 'bg-gray-300'" class="w-12 h-12 rounded-full flex items-center justify-center text-white">1</div>
        <div class="w-16 h-1 bg-gray-300 mx-2"></div>
        <div :class="step === 2 ? 'bg-blue-500' : 'bg-gray-300'" class="w-12 h-12 rounded-full flex items-center justify-center text-white">2</div>
      </div>

      <!-- Formulario de creación de restaurante -->
      <div v-if="step === 1">
        <h1 class="text-3xl font-bold mb-6">Crear Restaurante</h1>

        <form @submit.prevent="submitRestaurant" enctype="multipart/form-data">
          <!-- Nombre del restaurante -->
          <div class="mb-4">
            <label for="name" class="block text-gray-700">Nombre del Restaurante</label>
            <input
                v-model="restaurant.name"
                type="text"
                id="name"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-secondary"
                placeholder="Nombre del Restaurante"
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
                placeholder="Descripción del Restaurante"
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
                placeholder="Ubicación del Restaurante"
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
                placeholder="Número de Teléfono"
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
                placeholder="Correo Electrónico"
                required
            />
          </div>

          <!-- URL del sitio web -->
          <div class="mb-4">
            <label for="website_url" class="block text-gray-700">URL del Sitio Web (opcional)</label>
            <input
                v-model="restaurant.website_url"
                type="url"
                id="website_url"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-secondary"
                placeholder="https://www.ejemplo.com"
            />
          </div>

          <!-- Logo del restaurante -->
          <div class="mb-4">
            <label for="logo" class="block text-gray-700">Logo del Restaurante</label>
            <input
                @change="onLogoChange"
                type="file"
                id="logo"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-secondary"
                accept="image/*"
                required
            />
          </div>

          <!-- Imagen principal del restaurante -->
          <div class="mb-4">
            <label for="image" class="block text-gray-700">Imagen Principal del Restaurante</label>
            <input
                @change="onImageChange"
                type="file"
                id="image"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-secondary"
                accept="image/*"
                required
            />
          </div>

          <!-- Botón para enviar el formulario -->
          <button
              type="submit"
              class="w-full bg-secondary text-white py-2 rounded-lg hover:bg-opacity-80"
          >
            Siguiente: Horarios
          </button>

          <!-- Mensaje de error (si existe) -->
          <p v-if="errorMessage" class="text-red-500 text-center mt-4">{{ errorMessage }}</p>
        </form>
      </div>

      <!-- Formulario para los horarios del restaurante -->
      <div v-if="step === 2">
        <h1 class="text-3xl font-bold mb-6">Añadir Horarios</h1>

        <form @submit.prevent="submitSchedules">
          <div v-for="(schedule, index) in schedules" :key="index" class="mb-4">
            <label :for="'day' + index" class="block text-gray-700">{{ daysOfWeek[index] }}</label>

            <!-- Check para marcar si el restaurante está cerrado -->
            <div class="flex items-center mb-2">
              <input type="checkbox" v-model="schedule.closed" :id="'closed' + index" class="mr-2" />
              <label :for="'closed' + index" class="text-gray-700">Cerrado</label>
            </div>

            <div v-if="!schedule.closed" class="flex justify-between space-x-4">
              <div class="flex-1">
                <label :for="'open_time' + index" class="block text-gray-700">Hora de Apertura</label>
                <input
                    type="time"
                    v-model="schedule.open_time"
                    :id="'open_time' + index"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-secondary"
                />
              </div>
              <div class="flex-1">
                <label :for="'close_time' + index" class="block text-gray-700">Hora de Cierre</label>
                <input
                    type="time"
                    v-model="schedule.close_time"
                    :id="'close_time' + index"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-secondary"
                />
              </div>
            </div>
          </div>

          <!-- Botón para enviar el formulario de horarios -->
          <button
              type="submit"
              class="w-full bg-secondary text-white py-2 rounded-lg hover:bg-opacity-80"
          >
            Guardar Horarios
          </button>

          <!-- Mensaje de error (si existe) -->
          <p v-if="errorMessage" class="text-red-500 text-center mt-4">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '/src/axios.js';

export default {
  data() {
    return {
      step: 1, // Controla el paso actual del formulario
      restaurant: {
        name: '',
        description: '',
        location: '',
        phone: '',
        email: '',
        website_url: '',
        logo: null,
        image: null,
      },
      schedules: [
        { day_of_week: 0, open_time: '', close_time: '', closed: false },
        { day_of_week: 1, open_time: '', close_time: '', closed: false },
        { day_of_week: 2, open_time: '', close_time: '', closed: false },
        { day_of_week: 3, open_time: '', close_time: '', closed: false },
        { day_of_week: 4, open_time: '', close_time: '', closed: false },
        { day_of_week: 5, open_time: '', close_time: '', closed: false },
        { day_of_week: 6, open_time: '', close_time: '', closed: false },
      ],
      restaurantId: null, // Guarda el ID del restaurante recién creado
      errorMessage: '',
      daysOfWeek: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    };
  },
  methods: {
    onLogoChange(event) {
      this.restaurant.logo = event.target.files[0];
    },
    onImageChange(event) {
      this.restaurant.image = event.target.files[0];
    },
    async submitRestaurant() {
      const formData = new FormData();
      formData.append('name', this.restaurant.name);
      formData.append('description', this.restaurant.description);
      formData.append('location', this.restaurant.location);
      formData.append('phone', this.restaurant.phone);
      formData.append('email', this.restaurant.email);
      formData.append('website_url', this.restaurant.website_url);
      formData.append('logo', this.restaurant.logo);
      formData.append('image', this.restaurant.image);

      try {
        const response = await apiClient.post('/restaurants', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        this.restaurantId = response.data.restaurant.id; // Guardamos el ID del restaurante
        this.step = 2; // Avanzamos al paso 2
      } catch (error) {
        console.error('Error al crear el restaurante:', error);
        this.errorMessage = 'Error al crear el restaurante. Verifica los datos.';
      }
    },
    async submitSchedules() {
      try {
        const response = await apiClient.post(`/restaurants/${this.restaurantId}/schedules`, {
          schedules: this.schedules.map(schedule => ({
            day_of_week: schedule.day_of_week,
            open_time: schedule.closed ? null : schedule.open_time,
            close_time: schedule.closed ? null : schedule.close_time,
            closed: schedule.closed
          }))
        });
        this.$router.push('/restaurants'); // Redirigir a la página de restaurantes
      } catch (error) {
        console.error('Error al guardar los horarios:', error);
        this.errorMessage = 'Error al guardar los horarios. Verifica los datos.';
      }
    },
  },
};
</script>

<style scoped>
.progress-indicator div {
  width: 3rem;
  height: 3rem;
  line-height: 3rem;
  text-align: center;
  border-radius: 50%;
}

.progress-indicator div.bg-blue-500 {
  background-color: #3490dc;
}

.progress-indicator div.bg-gray-300 {
  background-color: #e2e8f0;
}
</style>

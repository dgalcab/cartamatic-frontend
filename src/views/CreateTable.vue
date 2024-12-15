<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">Crear Mesa</h2>
    <form @submit.prevent="createTable">
      <label for="uniqueNumber" class="block mb-2">Número Único de la Mesa:</label>
      <input
          v-model="uniqueNumber"
          id="uniqueNumber"
          type="text"
          class="border rounded p-2 w-full mb-4"
          required
      />

      <label for="capacity" class="block mb-2">Capacidad de la Mesa:</label>
      <input
          v-model="capacity"
          id="capacity"
          type="number"
          class="border rounded p-2 w-full mb-4"
          required
          min="1"
      />

      <label for="location" class="block mb-2">Ubicación de la Mesa (opcional):</label>
      <input
          v-model="location"
          id="location"
          type="text"
          class="border rounded p-2 w-full mb-4"
      />

      <button
          type="submit"
          class="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 w-full"
      >
        Crear Mesa
      </button>
    </form>

    <div v-if="message" class="text-green-500 mt-4">{{ message }}</div>
    <div v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      uniqueNumber: '',
      capacity: 1,
      location: '', // Agregar el campo para la ubicación
      message: '',
      errorMessage: '',
    };
  },
  methods: {
    async createTable() {
      try {
        const response = await this.$axios.post(
            `/restaurants/${this.$route.params.id}/tables`,
            {
              unique_number: this.uniqueNumber,
              capacity: this.capacity,
              location: this.location, // Incluir la ubicación en la solicitud
            }
        );
        this.message = response.data.message;
        this.errorMessage = '';
        this.uniqueNumber = '';
        this.capacity = 1;
        this.location = ''; // Resetear la ubicación
      } catch (error) {
        this.errorMessage = error.response.data.message || 'Error al crear la mesa';
        this.message = '';
      }
    },
  },
};
</script>

<style scoped>
/* Estilos opcionales */
</style>

<template>
  <form @submit.prevent="makeReservation" class="bg-white p-6 rounded shadow-lg">
    <label for="numPeople" class="block mb-2">Número de Personas:</label>
    <input id="numPeople" type="number" v-model="numPeople" min="1" required class="mb-4 p-2 border rounded w-full" />

    <label for="datetime" class="block mb-2">Fecha y Hora:</label>
    <input id="datetime" type="text" v-model="datetime" required class="mb-4 p-2 border rounded w-full flatpickr-datetime" />

    <label for="clientName" class="block mb-2">Nombre del Cliente:</label>
    <input id="clientName" type="text" v-model="clientName" required class="mb-4 p-2 border rounded w-full" />

    <label for="clientEmail" class="block mb-2">Email del Cliente:</label>
    <input id="clientEmail" type="email" v-model="clientEmail" required class="mb-4 p-2 border rounded w-full" />

    <label for="clientPhone" class="block mb-2">Teléfono del Cliente:</label>
    <input id="clientPhone" type="text" v-model="clientPhone" required class="mb-4 p-2 border rounded w-full" />

    <button type="submit" class="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 w-full">
      Reservar
    </button>
    <div v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</div>
  </form>
</template>

<script>
export default {
  props: {
    restaurantId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      numPeople: 1,
      datetime: '',
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      errorMessage: ''
    };
  },
  mounted() {
    setTimeout(() => {
      flatpickr("#datetime", {
        locale: 'es',
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        time_24hr: true,
        minuteIncrement: 30,
        disableMobile: true
      });
    }, 200);
  },
  methods: {
    async makeReservation() {
      try {
        await this.$axios.post(`/restaurants/${this.restaurantId}/reservations`, {
          restaurant_id: this.restaurantId,
          num_people: this.numPeople,
          datetime: this.datetime,
          client_name: this.clientName,
          client_email: this.clientEmail,
          client_phone: this.clientPhone
        });
        this.$emit('reservationSuccess');
      } catch (error) {
        this.errorMessage = 'Error al hacer la reserva.';
      }
    }
  }
};
</script>

<style scoped>
/* Opcionalmente, agregar estilos aquí */
</style>

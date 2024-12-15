<template>
  <div class="container">
    <!-- Si el usuario está autenticado, mostrar el selector de fecha, reservas y el botón para crear reservas -->
    <div v-if="isOwner">
      <!-- Botón para crear una nueva reserva -->
      <div class="flex justify-between items-center mb-6">
        <button @click="showReservationModal" class="create-reservation-button bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600">
          Crear Nueva Reserva
        </button>
      </div>

      <!-- Modal para crear nueva reserva -->
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <button class="modal-close" @click="closeModal">&times;</button>
          <h2 class="text-center font-bold text-lg mb-4">Crear Reserva</h2>
          <form @submit.prevent="makeReservation" class="bg-white p-6 rounded shadow-lg">
            <!-- Formulario para nueva reserva -->
            <div class="form-group mb-4">
              <label for="numPeople" class="block mb-2">Número de Personas:</label>
              <input id="numPeople" name="numPeople" type="number" v-model="numPeople" min="1" required class="p-2 border rounded w-full" />
            </div>

            <div class="form-group mb-4">
              <label for="datetime-modal" class="block mb-2">Fecha y Hora:</label>
              <input id="datetime-modal" name="datetime" type="text" v-model="datetime" required class="p-2 border rounded w-full" />
            </div>

            <div class="form-group mb-4">
              <label for="clientName" class="block mb-2">Nombre del Cliente:</label>
              <input id="clientName" name="clientName" type="text" v-model="clientName" required class="p-2 border rounded w-full" />
            </div>

            <div class="form-group mb-4">
              <label for="clientEmail" class="block mb-2">Email del Cliente:</label>
              <input id="clientEmail" name="clientEmail" type="email" v-model="clientEmail" required class="p-2 border rounded w-full" />
            </div>

            <div class="form-group mb-4">
              <label for="clientPhone" class="block mb-2">Teléfono del Cliente:</label>
              <input id="clientPhone" name="clientPhone" type="text" v-model="clientPhone" required class="p-2 border rounded w-full" />
            </div>

            <button type="submit" class="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 w-full">
              Reservar
            </button>
          </form>
        </div>
      </div>

      <!-- Selector de fecha centrado -->
      <div class="date-picker-container text-center mb-6">
        <label for="date" class="block text-lg font-semibold mb-2">Seleccionar Fecha</label>
        <input type="text" id="date" name="selectedDate" v-model="selectedDate" class="p-2 border rounded flatpickr">
      </div>

      <div class="columns flex">
        <!-- Columna izquierda: Lista de reservas con pestañas de almuerzos y cenas -->
        <div class="w-1-3 p-4 border-r text-center">
          <h2 class="text-2xl font-semibold mb-4 text-center">
            Reservas del día {{ selectedDate ? formatSelectedDate(selectedDate) : '' }}
          </h2>

          <!-- Pestañas de Almuerzos y Cenas -->
          <div class="tab-container">
            <button
                class="tab-button mr-2"
                :class="{ active: currentTab === 'lunch' }"
                @click="currentTab = 'lunch'"
            >
              Almuerzos
            </button>
            <button
                class="tab-button"
                :class="{ active: currentTab === 'dinner' }"
                @click="currentTab = 'dinner'"
            >
              Cenas
            </button>
          </div>

          <div v-if="loading" class="text-center">
            <p>Cargando reservas...</p>
          </div>

          <!-- Lista de reservas filtradas por almuerzos o cenas -->
          <div v-if="filteredReservations.length > 0" class="grid gap-4">
            <ReservationCard
                v-for="reservation in filteredReservations"
                :key="reservation.id"
                :reservation="reservation"
                @edit="editReservation"
                @delete="cancelReservation"
            />
          </div>

          <p v-else class="text-center">No hay reservas para esta fecha.</p>
        </div>

        <!-- Columna derecha: Mapa de mesas -->
        <div class="w-2-3 p-4 text-center">
          <TableMap :tables="tables" />
        </div>
      </div>
    </div>

    <!-- Si el usuario NO está autenticado, mostrar el formulario de reserva -->
    <div v-else class="flex justify-center items-center min-h-screen">
      <form @submit.prevent="makeReservation" class="bg-white p-6 rounded shadow-lg text-center max-w-lg w-full">
        <!-- Formulario para no autenticados -->
        <h2 class="text-2xl font-semibold mb-4 text-center">Hacer una Reserva</h2>

        <div class="form-group mb-4">
          <label for="numPeople" class="block mb-2">Número de Personas:</label>
          <input id="numPeople" name="numPeople" type="number" v-model="numPeople" min="1" required class="p-2 border rounded w-full" />
        </div>

        <div class="form-group mb-4">
          <label for="datetime" class="block mb-2">Fecha y Hora:</label>
          <input id="datetime" name="datetime" type="text" v-model="datetime" required class="p-2 border rounded w-full flatpickr-datetime" />
        </div>

        <div class="form-group mb-4">
          <label for="clientName" class="block mb-2">Nombre del Cliente:</label>
          <input id="clientName" name="clientName" type="text" v-model="clientName" required class="p-2 border rounded w-full" />
        </div>

        <div class="form-group mb-4">
          <label for="clientEmail" class="block mb-2">Email del Cliente:</label>
          <input id="clientEmail" name="clientEmail" type="email" v-model="clientEmail" required class="p-2 border rounded w-full" />
        </div>

        <div class="form-group mb-4">
          <label for="clientPhone" class="block mb-2">Teléfono del Cliente:</label>
          <input id="clientPhone" name="clientPhone" type="text" v-model="clientPhone" required class="p-2 border rounded w-full" />
        </div>

        <button type="submit" class="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 w-full">
          Reservar
        </button>

        <div v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</div>
      </form>
    </div>
  </div>
</template>

<script>
import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import 'flatpickr/dist/flatpickr.min.css';
import ReservationCard from './ReservationCard.vue';
import TableMap from './TableMap.vue';

export default {
  components: {
    ReservationCard,
    TableMap,
  },
  props: {
    isOwner: {
      type: Boolean,
      required: true,
    },
    restaurantId: {
      type: Number,
      required: true,
    },
  },
  data() {
    const today = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato 'YYYY-MM-DD'
    return {
      reservations: [],
      tables: [],
      selectedDate: today, // Fecha actual por defecto
      loading: false,
      numPeople: 1,
      datetime: today, // También puedes usar la fecha actual para la reserva
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      errorMessage: '',
      showModal: false, // Controla la visibilidad del modal
      currentTab: 'lunch', // Por defecto, mostrar almuerzos
    };
  },
  computed: {
    filteredReservations() {
      const cutoffHour = 17; // La hora límite entre almuerzos y cenas
      return this.reservations.filter((reservation) => {
        const reservationHour = new Date(reservation.datetime).getHours();
        return this.currentTab === 'lunch'
            ? reservationHour < cutoffHour
            : reservationHour >= cutoffHour;
      });
    },
  },
  mounted() {
    if (this.isOwner) {
      setTimeout(() => {
        flatpickr('#date', {
          locale: Spanish,
          dateFormat: 'Y-m-d',
          altInput: true,
          altFormat: 'F j, Y',
          defaultDate: this.selectedDate, // Fecha actual por defecto
          disableMobile: true,
        });
      }, 200);

      this.fetchTables();
      this.fetchReservationsForDate();
    } else {
      setTimeout(() => {
        flatpickr('#datetime', {
          locale: Spanish,
          enableTime: true,
          dateFormat: 'Y-m-d H:i',
          time_24hr: true,
          defaultDate: this.datetime, // Fecha actual para la reserva
          minuteIncrement: 30,
          disableMobile: true,
        });
      }, 200);
    }
  },
  methods: {
    formatSelectedDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('es-ES', options);
    },
    async fetchReservationsForDate() {
      if (this.selectedDate) {
        this.loading = true;
        try {
          const response = await this.$axios.get(`/restaurants/${this.restaurantId}/reservations`, {
            params: { date: this.selectedDate },
          });
          this.reservations = response.data.length > 0 ? response.data : [];
        } catch (error) {
          this.errorMessage = 'Error al cargar las reservas.';
        } finally {
          this.loading = false;
        }
      }
    },
    async fetchTables() {
      try {
        const response = await this.$axios.get(`/restaurants/${this.restaurantId}/tables`);
        this.tables = response.data;
        this.assignReservationsToTables();
      } catch (error) {
        this.errorMessage = 'Error al cargar las mesas.';
      }
    },
    async assignReservationsToTables() {
      if (this.selectedDate) {
        try {
          const response = await this.$axios.get(`/restaurants/${this.restaurantId}/reservations`, {
            params: { date: this.selectedDate },
          });
          const reservations = response.data;
          this.tables.forEach((table) => {
            table.reservations = reservations.filter((res) => res.table_id === table.id) || [];
          });
        } catch (error) {
          this.errorMessage = 'Error al asignar reservas a las mesas.';
        }
      }
    },
    async cancelReservation(reservationId) {
      try {
        await this.$axios.delete(`/restaurants/${this.restaurantId}/reservations/${reservationId}`);
        this.fetchReservationsForDate();
      } catch (error) {
        this.errorMessage = 'Error al cancelar la reserva.';
      }
    },
    async makeReservation() {
      try {
        await this.$axios.post(`/restaurants/${this.restaurantId}/reservations`, {
          restaurant_id: this.restaurantId,
          num_people: this.numPeople,
          datetime: this.datetime,
          client_name: this.clientName,
          client_email: this.clientEmail,
          client_phone: this.clientPhone,
        });

        // Cerrar el modal tras una reserva exitosa
        this.closeModal();

        // Redirigir a la vista del restaurante tras la reserva exitosa
        this.$router.push({ name: 'RestaurantView', params: { id: this.restaurantId } });
      } catch (error) {
        if (error.response) {
          this.errorMessage = 'Error al hacer la reserva: ' + error.response.data.message;
        } else if (error.request) {
          this.errorMessage = 'No se recibió respuesta del servidor.';
        } else {
          this.errorMessage = 'Error en la solicitud: ' + error.message;
        }
      }
    },
    editReservation(id) {
      this.$router.push({ name: 'UpdateReservation', params: { id } });
    },
    showReservationModal() {
      this.showModal = true;

      // Iniciar flatpickr después de mostrar el modal
      this.$nextTick(() => {
        flatpickr('#datetime-modal', {
          locale: Spanish,
          enableTime: true,
          dateFormat: 'Y-m-d H:i',
          time_24hr: true,
          minuteIncrement: 30,
          disableMobile: true,
        });
      });
    },
    closeModal() {
      this.showModal = false;
    },
  },
  watch: {
    selectedDate(newDate) {
      this.fetchReservationsForDate();
      this.assignReservationsToTables();
    },
  },
};
</script>

<style scoped>
.container {
  padding: 0 20px;
}

.min-h-screen {
  min-height: 100vh;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.max-w-lg {
  max-width: 32rem; /* Ancho máximo del formulario */
}

.w-full {
  width: 100%;
}

.bg-white {
  background-color: white;
}

.p-6 {
  padding: 1.5rem;
}

.rounded {
  border-radius: 0.375rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}
</style>

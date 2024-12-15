<template>
  <div class="table-map-container">
    <!-- Título centrado -->
    <h2 class="map-title">Mapa de las Mesas</h2>

    <!-- Pestañas dinámicas para ubicaciones -->
    <div v-if="locations.length > 0" class="tabs">
      <button
          v-for="location in locations"
          :key="location"
          @click="selectLocation(location)"
          :class="{'active-tab': currentLocation === location}"
          class="tab-button"
      >
        {{ location }}
      </button>
    </div>

    <!-- Pestañas para Almuerzos y Cenas -->
    <div v-if="currentLocation" class="meal-tabs">
      <button
          @click="selectMealTime('lunch')"
          :class="{'active-tab': currentMealTime === 'lunch'}"
          class="meal-tab-button"
      >
        Almuerzos
      </button>
      <button
          @click="selectMealTime('dinner')"
          :class="{'active-tab': currentMealTime === 'dinner'}"
          class="meal-tab-button"
      >
        Cenas
      </button>
    </div>

    <!-- Área del mapa con las mesas -->
    <div class="map-area">
      <div v-for="table in filteredTables" :key="table.id" class="table-box">
        <div
            :class="['table-square', table.reservations.length ? 'reserved' : 'available']"
            @click="showReservationModal(table)"
        >
          <i class="fas fa-chair"></i>
          <span class="table-number">{{ table.unique_number }}</span>
          <div class="table-info space-between">
            <div v-if="table.reservations.length">
              <div v-for="reservation in table.reservations" :key="reservation.id">
                <i class="fas fa-clock"></i> {{ formatTime(reservation.datetime) }}<br />
                <i class="fas fa-user-friends"></i> {{ reservation.num_people }}
              </div>
            </div>
            <span v-else>Libre</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para mostrar la reserva -->
    <div v-if="selectedTable" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">&times;</button>
        <h3 class="modal-title">Detalles de la reserva</h3>
        <p><strong>Mesa:</strong> {{ selectedTable.unique_number }}</p>
        <div v-if="selectedTable.reservations.length">
          <div v-for="reservation in selectedTable.reservations" :key="reservation.id">
            <strong>Cliente:</strong> {{ reservation.client_name }} <br />
            <strong>Email:</strong>
            <a :href="`mailto:${reservation.client_email}`">{{ reservation.client_email }}</a><br />
            <strong>Teléfono:</strong>
            <a :href="`tel:${reservation.client_phone}`">{{ reservation.client_phone }}</a><br />
            <strong>Hora:</strong> {{ formatTime(reservation.datetime) }} <br />
            <strong>Personas:</strong> {{ reservation.num_people }} <br />
            <hr />
          </div>
        </div>
        <p v-else><strong>Esta mesa está libre.</strong></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tables: Array, // Se recibe un array de mesas con reservas
  },
  data() {
    return {
      currentLocation: '',
      currentMealTime: 'lunch', // Por defecto, se muestra el almuerzo
      selectedTable: null,
    };
  },
  computed: {
    locations() {
      const allLocations = this.tables.map((table) => table.location);
      return [...new Set(allLocations)];
    },
    filteredTables() {
      console.log(`Filtrando mesas para ubicación: ${this.currentLocation} y comida: ${this.currentMealTime}`);

      // Filtrar las mesas por ubicación y luego asignar las reservas filtradas según la hora
      return this.tables
          .filter((table) => table.location === this.currentLocation)
          .map((table) => {
            const filteredReservations = this.filterReservationsByMealTime(table.reservations || []);
            console.log(`Mesa ${table.unique_number} tiene las siguientes reservas filtradas:`, filteredReservations);
            return { ...table, reservations: filteredReservations };
          })
          .sort((a, b) => b.reservations.length - a.reservations.length); // Las mesas reservadas primero
    },
  },
  methods: {
    selectLocation(location) {
      this.currentLocation = location;
      this.currentMealTime = 'lunch'; // Reiniciar a almuerzos por defecto
      console.log(`Ubicación seleccionada: ${location}`);
    },
    selectMealTime(mealTime) {
      this.currentMealTime = mealTime;
      console.log(`Filtrando reservas para: ${mealTime}`);
    },
    filterReservationsByMealTime(reservations) {
      const cutoffTime = 17; // Las 17:00 es el corte entre almuerzos y cenas

      // Asegurarse de que el `datetime` sea una fecha válida antes de compararla
      return reservations
          .filter((reservation) => {
            const reservationTime = new Date(reservation.datetime);
            const hour = reservationTime.getHours();
            if (isNaN(hour)) {
              console.log(`Error: Formato de fecha/hora inválido en la reserva:`, reservation.datetime);
              return false;
            }

            // Filtrar por almuerzo o cena dependiendo de la hora
            return this.currentMealTime === 'lunch' ? hour < cutoffTime : hour >= cutoffTime;
          })
          .sort((a, b) => new Date(a.datetime) - new Date(b.datetime)); // Ordenar las reservas por hora
    },
    showReservationModal(table) {
      this.selectedTable = table;
    },
    closeModal() {
      this.selectedTable = null;
    },
    formatTime(datetime) {
      const date = new Date(datetime);
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    },
  },
  mounted() {
    // Mostrar todas las reservas recibidas del componente padre
    console.log('Mesas recibidas del componente padre:', this.tables);

    // Seleccionar automáticamente la primera ubicación y el almuerzo por defecto
    if (this.locations.length > 0) {
      this.currentLocation = this.locations[0];
      this.currentMealTime = 'lunch';
      console.log(`Ubicación inicial seleccionada: ${this.currentLocation}`);
    }
  },
};
</script>

<style scoped>
.table-map-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.map-title {
  color: #35455d;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}

.tab-button {
  padding: 10px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: white;
  background-color: #35455d;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.tab-button:hover {
  background-color: #d47e2f;
}

.active-tab {
  background-color: #d47e2f;
  color: white;
}

.meal-tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}

.meal-tab-button {
  padding: 10px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: white;
  background-color: #35455d;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.meal-tab-button:hover {
  background-color: #d47e2f;
}

.active-tab {
  background-color: #d47e2f;
  color: white;
}

.map-area {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

@media (max-width: 768px) {
  .map-area {
    grid-template-columns: repeat(2, 1fr);
  }
}

.table-box {
  position: relative;
}

.table-square {
  background-color: #f5f5f5;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  text-align: center;
  height: 160px;
  width: 160px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.reserved {
  background-color: #f28f8f;
}

.available {
  background-color: #a4f6a4;
}

.table-info {
  margin-top: 5px;
  font-size: 14px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: left;
  position: relative;
  width: 300px;
}

.modal-title {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 15px;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #d47e2f;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
}
</style>

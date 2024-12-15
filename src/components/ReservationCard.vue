<template>
  <div class="reservation-card p-4 bg-gray-100 rounded shadow mb-4">
    <!-- Información principal de la reserva -->
    <div class="flex justify-between items-center font-bold mb-2 text-lg">
      <div>
        <i class="fas fa-chair"></i> Mesa {{ reservation.table_id }}
      </div>
      <div>
        <i class="fas fa-user-friends"></i> {{ reservation.num_people }}
      </div>
      <div>
        <i class="fas fa-clock"></i> {{ formatTime(reservation.datetime) }}
      </div>
    </div>
    <p><strong>Cliente: </strong>{{ reservation.client_name }}</p>
    <p><strong>Email: </strong>{{ reservation.client_email }}</p>
    <p><strong>Teléfono: </strong>{{ reservation.client_phone }}</p>


    <!-- Botones para editar y eliminar la reserva -->
    <div class="flex justify-end space-x-2 mt-2">
      <button class="bg-yellow-500 text-white py-1 px-2 rounded" @click="$emit('edit', reservation.id)">
        <i class="fas fa-edit"></i> Editar
      </button>
      <button class="bg-red-500 text-white py-1 px-2 rounded" @click="$emit('delete', reservation.id)">
        <i class="fas fa-trash"></i> Eliminar
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    reservation: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatTime(datetime) {
      return new Date(datetime).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
  }
};
</script>

<style scoped>
/* Opcionalmente, agregar estilos aquí */
</style>

<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4 mt-10">Mesas del Restaurante</h2>

    <div v-if="groupedTables && Object.keys(groupedTables).length > 0">
      <!-- Iterar sobre las ubicaciones (locations) -->
      <div v-for="(tables, location) in groupedTables" :key="location" class="mb-8">
        <!-- Título con la ubicación -->
        <h3 class="text-xl font-semibold mb-4">Mesas {{ location ? location : 'Sin Ubicación' }}</h3>

        <!-- Grid para mostrar las mesas de la ubicación actual -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="table in tables" :key="table.id" class="p-4 bg-gray-100 rounded shadow">
            <p><strong>Número Único: </strong>{{ table.unique_number }}</p>
            <p><strong>Capacidad: </strong>{{ table.capacity }}</p>
          </div>
        </div>
      </div>
    </div>

    <p v-else>No hay mesas creadas aún.</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tables: [],
      groupedTables: {}, // Para agrupar las mesas por ubicación
    };
  },
  async mounted() {
    await this.fetchTables();
  },
  methods: {
    // Función para organizar las mesas por ubicación
    groupTablesByLocation(tables) {
      const grouped = {};

      tables.forEach(table => {
        const location = table.location || 'Sin Ubicación'; // Agrupar por ubicación o 'Sin Ubicación'
        if (!grouped[location]) {
          grouped[location] = [];
        }
        grouped[location].push(table);
      });

      return grouped;
    },

    async fetchTables() {
      try {
        const response = await this.$axios.get(`/restaurants/${this.$route.params.id}/tables`);
        this.tables = response.data;
        this.groupedTables = this.groupTablesByLocation(this.tables); // Agrupar mesas por ubicación
      } catch (error) {
        console.error('Error al cargar las mesas:', error);
      }
    },
  },
};
</script>

<style scoped>
/* Estilos opcionales */
</style>

<template>
  <div class="info-tab">
    <h2 class="text-2xl font-semibold mb-4 text-center">Datos del Restaurante</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Columna de Datos del Restaurante -->
      <div class="p-4 bg-white rounded-lg shadow-lg flex flex-col h-full">
        <h2 class="text-xl font-bold text-center mb-4">Información General</h2>
        <p><strong>Ubicación:  </strong> {{ restaurant.location }}</p>
        <p><strong>Teléfono:  </strong>
          <a :href="`tel:${restaurant.phone}`" class="text-orange-500 hover:underline">{{ restaurant.phone }}</a>
        </p>
        <p><strong>Email:  </strong>
          <a :href="`mailto:${restaurant.email}`" class="text-orange-500 hover:underline">{{ restaurant.email }}</a>
        </p>
        <p><strong>Web:  </strong>
          <a :href="restaurant.website_url" target="_blank" class="text-orange-500 hover:underline">{{ restaurant.website_url }}</a>
        </p>
      </div>

      <!-- Columna de Horarios -->
      <div class="p-4  rounded-lg shadow-lg flex flex-col h-full">
        <h2 class="text-xl font-bold text-center mb-4">Horarios del Restaurante</h2>
        <div class="p-2 bg-white rounded-lg shadow-lg flex-grow">
          <table class="min-w-full border-collapse text-center">
            <thead>
            <tr>
              <th class="border-b-2 border-gray-300 px-4 py-2">Día</th>
              <th class="border-b-2 border-gray-300 px-4 py-2">Horario</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="schedule in schedules" :key="schedule.day_of_week">
              <td class="border-b border-gray-300 px-4 py-2">{{ daysOfWeek[schedule.day_of_week] }}</td>
              <td class="border-b border-gray-300 px-4 py-2">
                {{ (schedule.open_time && schedule.close_time) ? `${schedule.open_time} - ${schedule.close_time}` : 'Cerrado' }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Columna del Código QR -->
      <div class="p-4 bg-white rounded-lg shadow-lg flex flex-col items-center h-full">
        <h3 class="text-xl font-bold text-center mb-4">Código QR</h3>
        <qrcode-vue :value="`http://localhost:5173/restaurants/${restaurant.id}`" :size="150" level="H" render-as="svg" class="mt-2"></qrcode-vue>
        <p class="mt-2 text-center">Escanea el QR para ver el sitio web del restaurante.</p>
        <button
            v-if="isAuthenticated"
            class="mt-4 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
            @click="downloadQRCode"
        >
          Descargar QR en Alta Resolución
        </button>
      </div>
    </div>

    <!-- Mapa de Leaflet -->
    <div id="map" class="h-64 w-full rounded-lg shadow-lg my-4"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import QrcodeVue from 'qrcode.vue';

export default {
  name: "InfoTab",
  components: {
    QrcodeVue,
  },
  props: {
    restaurant: {
      type: Object,
      required: true,
    },
    schedules: {
      type: Array,
      required: true,
    },
    isAuthenticated: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      daysOfWeek: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    };
  },
  mounted() {
    this.initializeMap();
  },
  methods: {
    initializeMap() {
      const location = this.restaurant.location;
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;

      fetch(url)
          .then(response => response.json())
          .then(data => {
            if (data && data.length > 0) {
              const { lat, lon } = data[0];
              const map = L.map('map').setView([lat, lon], 13);
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
              }).addTo(map);

              L.marker([lat, lon])
                  .addTo(map)
                  .bindPopup(this.restaurant.name)
                  .openPopup();
            } else {
              console.warn('No se encontraron coordenadas para:', location);
            }
          })
          .catch(error => {
            console.error('Error al obtener coordenadas:', error);
          });
    },
    downloadQRCode() {
      const canvas = document.querySelector('canvas');
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${this.restaurant.name}_QR.png`;
      link.click();
    }
  }
};
</script>

<style scoped>
.info-tab {
  padding: 20px;
}

#map {
  height: 200px;
}

.qr-container {
  text-align: center;
}
</style>

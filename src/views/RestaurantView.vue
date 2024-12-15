  <template>
    <div v-if="restaurant" class="restaurant-view">
      <div class="restaurant-banner relative w-full h-80 mt-20">
        <div class="overlay absolute inset-0 bg-primary opacity-50"></div>
        <img :src="getRestaurantImage(restaurant.image_url)" alt="Restaurant Image" class="w-full h-full object-cover">
        <div class="restaurant-title absolute inset-0 flex flex-col justify-center items-center">
          <div class="bg-white p-3 rounded-full shadow-lg border-4 border-orange-500 mb-4">
            <img :src="getRestaurantLogo(restaurant.logo_url)" alt="Restaurant Logo" class="w-20 h-20 rounded-full object-cover">
          </div>
          <h1 class="text-5xl font-extrabold text-white">{{ restaurant.name }}</h1>
        </div>
      </div>

      <!-- Pestañas con desplazamiento horizontal en móviles -->
      <div class="tabs-container flex justify-start mt-8 overflow-x-auto whitespace-nowrap scrollbar-hide px-4">
        <button
            class="tab px-6 py-2 mx-2 text-white"
            :class="{ 'bg-primary': selectedTab === 'menu', 'bg-gray-300': selectedTab !== 'menu' }"
            @click="selectedTab = 'menu'; resetMap()"
        >
          Menú
        </button>

        <button
            class="tab px-6 py-2 mx-2 text-white"
            :class="{ 'bg-primary': selectedTab === 'reservations', 'bg-gray-300': selectedTab !== 'reservations' }"
            @click="selectedTab = 'reservations'"
        >
          Reservas
        </button>
        <button
            class="tab px-6 py-2 mx-2 text-white"
            :class="{ 'bg-primary': selectedTab === 'info', 'bg-gray-300': selectedTab !== 'info' }"
            @click="selectedTab = 'info'; initializeMap()"
        >
          Datos del Restaurante
        </button>
        <!-- Mostrar la pestaña de mesas solo si el usuario está autenticado -->
        <button
            v-if="isOwner"
            class="tab px-6 py-2 mx-2 text-white"
            :class="{ 'bg-primary': selectedTab === 'tables', 'bg-gray-300': selectedTab !== 'tables' }"
            @click="selectedTab = 'tables'"
        >
          Mesas
        </button>
      </div>

      <!-- Mostrar el contenido basado en la pestaña seleccionada -->
      <div v-if="selectedTab === 'menu'" class="tab-content mt-8">
        <MenuTab :restaurantId="restaurant.id" />
      </div>

      <div v-if="selectedTab === 'info'" class="tab-content mt-8">
        <InfoTab :restaurant="restaurant" :schedules="schedules" />
      </div>

      <div v-if="selectedTab === 'reservations'" class="tab-content mt-8">
        <ReservationTab :restaurantId="restaurant.id" :isOwner="isOwner" />
      </div>

      <!-- Mostrar la pestaña de mesas solo si el usuario está autenticado -->
      <div v-if="selectedTab === 'tables' && isOwner" class="tab-content mt-8">
        <CreateTable :restaurantId="restaurant.id" />
        <TableList :restaurantId="restaurant.id" />
      </div>
    </div>

    <div v-else class="text-center py-12">
      <p>Cargando datos del restaurante...</p>
    </div>
  </template>

  <script>
  import MenuTab from '/src/components/MenuTab.vue';
  import InfoTab from '/src/components/InfoTab.vue';
  import ReservationTab from '/src/components/ReservationTab.vue';
  import CreateTable from '/src/views/CreateTable.vue'; // Ajuste según la carpeta
  import TableList from '/src/views/TableList.vue'; // Ajuste según la carpeta

  import apiClient from '/src/axios.js';  // Importa tu cliente de Axios personalizado

  export default {
    components: {
      MenuTab,
      InfoTab,
      ReservationTab,
      CreateTable,
      TableList
    },
    data() {
      return {
        selectedTab: 'menu',
        restaurant: null,
        schedules: [],
      };
    },
    async mounted() {
      await this.fetchRestaurantData();
      await this.fetchRestaurantSchedules();
    },
    computed: {
      isOwner() {
        const token = localStorage.getItem('auth_token');
        return !!token; // Si hay un token, el usuario está autenticado y es considerado propietario
      }
    },
    methods: {
      async fetchRestaurantData() {
        const restaurantId = this.$route.params.id;
        try {
          const response = await apiClient.get(`/restaurants/${restaurantId}`);
          this.restaurant = response.data;
        } catch (error) {
          console.error('Error fetching restaurant data:', error);
        }
      },
      async fetchRestaurantSchedules() {
        const restaurantId = this.$route.params.id;
        try {
          const response = await apiClient.get(`/restaurants/${restaurantId}/schedules`);
          this.schedules = response.data;
        } catch (error) {
          console.error('Error fetching restaurant schedules:', error);
          if (error.response && error.response.status === 401) {
            console.error('No autorizado, el token puede haber expirado o ser inválido.');
          }
        }
      },
      getRestaurantImage(image_url) {
        return image_url ? `http://localhost:8000/storage/${image_url}` : 'path/to/default/image.jpg';
      },
      getRestaurantLogo(logo_url) {
        return logo_url ? `http://localhost:8000/storage/${logo_url}` : 'path/to/default/logo.jpg';
      },
      resetMap() {
        // Resetear lógica del mapa si es necesario
      },
      initializeMap() {
        // Inicializar lógica del mapa si es necesario
      },
    }
  };
  </script>

  <style scoped>
  .restaurant-banner {
    position: relative;
    height: 20rem;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  .restaurant-title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .tabs .tab {
    cursor: pointer;
    font-weight: bold;
    padding: 10px 20px;
    border-radius: 5px;
  }

  .tabs-container {
    display: flex;
    overflow-x: auto;
    scrollbar-width: none; /* Oculta el scroll en Firefox */
    padding-left: 1rem; /* Añade un margen inicial en móviles */
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none; /* Oculta el scroll en Chrome, Safari y Edge */
  }

  .tab {
    cursor: pointer;
    font-weight: bold;
    padding: 10px 20px;
    border-radius: 5px;
    flex-shrink: 0; /* Asegura que no se comprima el botón en móviles */
  }

  @media (min-width: 768px) {
    .tabs-container {
      justify-content: center;
      overflow-x: unset;
      padding-left: 0; /* Eliminar margen en pantallas más grandes */
    }
  }

  .restaurant-banner {
    position: relative;
    height: 20rem;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  .restaurant-title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
  </style>

<template>
  <div class="relative bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
    <!-- Contenedor de la imagen y el logo -->
    <div class="relative">
      <!-- Imagen del restaurante -->
      <img :src="getRestaurantImage(image_url)" alt="Restaurant Image" class="w-full h-40 object-cover mb-12 rounded-lg">

      <!-- Logo del restaurante en un círculo con borde naranja -->
      <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white rounded-full p-2 shadow-lg border-4 border-orange-500">
        <img :src="getRestaurantLogo(logo_url)" alt="Restaurant Logo" class="w-16 h-16 rounded-full object-cover">
      </div>
    </div>

    <!-- Nombre del restaurante -->
    <h2 class="text-xl font-semibold mb-2 text-center">{{ name }}</h2>

    <!-- Descripción del restaurante en cursiva y alineada -->
    <p class="mb-4 italic text-center">{{ description }}</p>

    <!-- Iconos con la información adicional -->
    <div class="flex flex-col space-y-2 mb-4">
      <!-- Ubicación -->
      <div class="flex items-center justify-center">
        <i class="fas fa-map-marker-alt mr-2 text-secondary"></i>
        <span>{{ location }}</span>
      </div>

      <!-- Teléfono (con enlace para llamada y en negrita) -->
      <div class="flex items-center justify-center">
        <i class="fas fa-phone mr-2 text-secondary"></i>
        <a :href="`tel:${phone}`" class="font-bold text-secondary hover:underline">{{ phone }}</a>
      </div>
    </div>

    <!-- Botón de Ver (siempre visible) -->
    <div class="flex justify-center">
      <router-link :to="`/restaurants/${id}`" class="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-opacity-80 transition-colors duration-200 ease-in-out text-lg font-bold">
        Ver
      </router-link>
    </div>

    <!-- Botones de acciones (Actualizar y Eliminar) si está autenticado y es el dueño -->
    <div v-if="isAuthenticated && isOwner" class="flex justify-between space-x-2 mt-4">
      <router-link :to="`/restaurants/${id}/edit`" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 transition-colors duration-200 ease-in-out">
        Actualizar
      </router-link>

      <button @click="showModal = true" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 ease-in-out">
        Eliminar
      </button>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">¿Estás seguro?</h3>
        <p class="mb-6">Esta acción eliminará permanentemente el restaurante.</p>
        <div class="flex justify-between">
          <button @click="confirmDelete" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Confirmar
          </button>
          <button @click="showModal = false" class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RestaurantCard",
  props: {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    location: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    website_url: {
      type: String,
      required: false
    },
    image_url: {
      type: String,
      required: false
    },
    logo_url: {
      type: String,
      required: false
    },
    user_id: {
      type: Number,
      required: true
    },
    current_user_id: {
      type: Number,
      required: true
    },
    isAuthenticated: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      showModal: false, // Controla la visibilidad del modal
    };
  },
  computed: {
    isOwner() {
      return this.user_id === this.current_user_id;
    }
  },
  methods: {
    getRestaurantImage(image_url) {
      return image_url ? `http://localhost:8000/storage/${image_url}` : 'path/to/default/image.jpg';
    },
    getRestaurantLogo(logo_url) {
      return logo_url ? `http://localhost:8000/storage/${logo_url}` : 'path/to/default/logo.jpg';
    },
    confirmDelete() {
      this.$emit('delete-restaurant', this.id);
      this.showModal = false; // Oculta el modal después de confirmar
    }
  }
};
</script>

<style scoped>
.text-secondary {
  color: #d47e2f; /* Color secundario */
}

.hover\:shadow-xl:hover {
  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.1); /* Sombra más fuerte al hacer hover */
}

.modal {
  background: rgba(0, 0, 0, 0.5); /* Fondo semi-transparente */
}

.bg-white {
  background-color: #fff; /* Fondo blanco */
}

.border-orange-500 {
  border-color: #d47e2f; /* Borde naranja corporativo */
}

.bg-secondary {
  background-color: #d47e2f; /* Color secundario */
}
</style>

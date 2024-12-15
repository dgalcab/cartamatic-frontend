<template>
  <header class="fixed top-0 left-0 w-full z-50 bg-white shadow">
    <div class="container mx-auto flex justify-between items-center p-4">
      <!-- Logo dinámico con redirección a Home -->
      <router-link to="/" class="flex items-center" @click="toggleMenu(false)">
        <img src="/src/assets/logo_cartamatic_color.png" alt="Logo Cartamatic" class="h-12 md:h-16" />
      </router-link>

      <!-- Menu (visible en PC y oculto en móviles) -->
      <nav class="hidden md:flex items-center space-x-6 text-xl font-semibold">
        <router-link to="/" class="text-blue-900 hover:text-orange-500" @click="toggleMenu(false)">Inicio</router-link>
        <router-link to="/restaurants" class="text-blue-900 hover:text-orange-500" @click="toggleMenu(false)">Restaurantes</router-link>

        <template v-if="isAuthenticated">
          <span class="text-black" :style="{ fontSize: '0.875rem' }">Bienvenido, <strong>{{ userName }}</strong></span>
          <button @click="logout" class="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-opacity-80">Logout</button>
        </template>

        <template v-else>
          <router-link to="/login">
            <button class="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-opacity-80">Acceder</button>
          </router-link>
          <router-link to="/register">
            <button class="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-opacity-80">Darse de Alta</button>
          </router-link>
        </template>
      </nav>

      <!-- Hamburger menu button (visible en móviles) -->
      <button @click="toggleMenu()" class="md:hidden text-blue-900">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Mobile Menu (visible al hacer clic en el menú hamburguesa) -->
    <nav v-if="isMenuOpen" class="md:hidden bg-primary bg-opacity-90 p-4 absolute top-16 left-0 w-full flex flex-col space-y-4 text-center font-semibold">
      <router-link to="/" class="text-white hover:text-secondary" @click="toggleMenu(false)">Inicio</router-link>
      <router-link to="/restaurants" class="text-white hover:text-secondary" @click="toggleMenu(false)">Restaurantes</router-link>

      <template v-if="isAuthenticated">
        <span class="text-white">Bienvenid@, {{ userName }}</span>
        <button @click="logout" class="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-opacity-80">Logout</button>
      </template>

      <template v-else>
        <router-link to="/login">
          <button class="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-opacity-80" @click="toggleMenu(false)">Acceder</button>
        </router-link>
        <router-link to="/register">
          <button class="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-opacity-80" @click="toggleMenu(false)">Darse de Alta</button>
        </router-link>
      </template>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      isMenuOpen: false,
      isAuthenticated: false, // Estado de autenticación
      userName: '', // Nombre del usuario autenticado
    };
  },
  mounted() {
    this.checkAuthStatus(); // Verificar si el usuario está autenticado al cargar el componente
  },
  methods: {
    toggleMenu(forceClose = null) {
      if (forceClose !== null) {
        this.isMenuOpen = forceClose;
      } else {
        this.isMenuOpen = !this.isMenuOpen;  // Cambia el estado del menú
      }
    },
    checkAuthStatus() {
      const token = localStorage.getItem('auth_token');
      const userName = localStorage.getItem('user_name');

      if (token && userName) {
        this.isAuthenticated = true;
        this.userName = userName;
      } else {
        this.isAuthenticated = false;
        this.userName = '';
      }
    },
    logout() {
      // Limpiar el token y nombre del usuario al hacer logout
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_name');
      this.isAuthenticated = false;
      this.userName = '';
      this.$router.push({ name: 'Restaurants' }); // Redirigir al login
      this.toggleMenu(false); // Cerrar el menú después de hacer logout
    },
  },
  watch: {
    // Verificar si el estado de autenticación cambia
    '$route'() {
      this.checkAuthStatus();
    }
  },
}
</script>

<style scoped>
/* Añadir un margen superior al contenido para que no quede oculto detrás del header */
body, .app-content {
  margin-top: 4rem; /* Ajusta esto según la altura del header */
}

/* Estilos adicionales para el header */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

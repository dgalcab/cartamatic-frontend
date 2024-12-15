<template>
  <header class="relative w-full min-h-screen bg-cover bg-center" :style="{ backgroundImage: 'url(/src/assets/hero_restaurant.jpg)' }">
    <div class="absolute inset-0 bg-primary bg-opacity-50 flex flex-col justify-center items-center text-center">
      <!-- Hero Title -->
      <h1 class="text-5xl text-white font-bold mb-4">¡Bienvenido a Cartamatic!</h1>

      <!-- Texto explicativo -->
      <p class="text-white text-lg mb-6 max-w-xl">
        Explora los mejores restaurantes, descubre su menú digital y reserva tu mesa fácilmente.
        Regístrate para una experiencia completa y accede a nuestras recomendaciones exclusivas.
      </p>

      <!-- Buttons -->
      <div class="space-x-4">
        <!-- Botón Acceder que redirige a /login -->
        <router-link to="/login">
          <button class="bg-secondary text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-opacity-80">
            Acceder
          </button>
        </router-link>

        <!-- Botón Darse de Alta que redirige a /register -->
        <router-link to="/register">
          <button class="bg-white text-primary px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-200">
            Darse de Alta
          </button>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeroSection',
}
</script>

<style scoped>
/* Añadir estilos adicionales si lo necesitas */
</style>

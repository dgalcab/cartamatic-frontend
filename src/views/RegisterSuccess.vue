<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg text-center">
      <h1 class="text-2xl font-bold mb-4">Usuario creado correctamente</h1>
      <p class="text-gray-700 mb-6">Ahora puedes acceder a tu cuenta.</p>

      <!-- Botón que redirige a la página de login -->
      <router-link to="/login">
        <button class="bg-secondary text-white py-2 px-4 rounded-lg hover:bg-opacity-80">
          Acceder
        </button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterSuccess',
};
</script>

<style scoped>
/* Añadir estilos adicionales si lo necesitas */
</style>

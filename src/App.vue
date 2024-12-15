<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header estará en todas las páginas -->
    <Header />

    <!-- Contenido dinámico de cada vista -->
    <router-view class="flex-grow"></router-view>

    <!-- Footer estará en todas las páginas -->
    <Footer />
  </div>
</template>

<script>
import Header from './components/Header.vue'; // Importa el Header
import Footer from './components/Footer.vue'; // Importa el Footer

export default {
  name: 'App',
  components: {
    Header,
    Footer,
  },
};
</script>

<style scoped>
/* Puedes agregar estilos generales aquí si lo necesitas */
</style>

<template>
  <div class="menu-item-form">
    <h2 class="text-2xl font-bold mb-4">{{ isEditing ? 'Editar Plato' : 'Agregar Plato a la Categoría' }}</h2>
    <form @submit.prevent="handleSubmit">
      <input v-model="item.name" type="text" placeholder="Nombre del plato" required class="w-full p-2 mb-4 border rounded" />
      <textarea v-model="item.description" placeholder="Descripción" class="w-full p-2 mb-4 border rounded"></textarea>
      <input v-model="item.price" type="number" placeholder="Precio" required class="w-full p-2 mb-4 border rounded" />

      <!-- Selector de alérgenos -->
      <AllergensSelector :allergens="allergens" v-model="item.allergens" />

      <button type="submit" class="bg-secondary text-white px-4 py-2 rounded-lg">{{ isEditing ? 'Actualizar Plato' : 'Agregar Plato' }}</button>
    </form>
  </div>
</template>

<script>
import AllergensSelector from './AllergensSelector.vue';

export default {
  components: {
    AllergensSelector
  },
  props: ['categoryId', 'menuItemId'], // La categoría a la que pertenece el plato y, si se está editando, el id del plato
  data() {
    return {
      item: {
        name: '',
        description: '',
        price: 0,
        allergens: [], // IDs de los alérgenos seleccionados
      },
      allergens: [], // Alérgenos disponibles
      isEditing: false,
    };
  },
  async mounted() {
    this.fetchAllergens(); // Cargar alérgenos disponibles
    if (this.menuItemId) {
      this.isEditing = true;
      this.fetchMenuItem();
    }
  },
  methods: {
    async fetchMenuItem() {
      try {
        const response = await this.$axios.get(`/api/menu-items/${this.menuItemId}`);
        this.item = response.data;
      } catch (error) {
        console.error('Error fetching menu item', error);
      }
    },
    async fetchAllergens() {
      try {
        const response = await this.$axios.get('/api/allergens');
        this.allergens = response.data;
      } catch (error) {
        console.error('Error fetching allergens', error);
      }
    },
    async handleSubmit() {
      try {
        if (this.isEditing) {
          await this.$axios.put(`/api/menu-items/${this.menuItemId}`, this.item);
        } else {
          await this.$axios.post(`/api/menu-categories/${this.categoryId}/items`, this.item);
        }
        this.$router.push({ name: 'MenuTab' });
      } catch (error) {
        console.error('Error saving menu item', error);
      }
    }
  }
};
</script>

<style scoped>
/* Añade tus estilos personalizados */
</style>

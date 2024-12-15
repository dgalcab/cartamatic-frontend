<template>
  <div class="create-category ">
    <h2 class="text-2xl font-bold mb-4 mt-20">Actualizar Categoría</h2>
    <form @submit.prevent="handleSubmit">
      <input v-model="category.name" type="text" placeholder="Nombre de la categoría" required class="w-full p-2 mb-4 border rounded" />
      <textarea v-model="category.description" placeholder="Descripción" class="w-full p-2 mb-4 border rounded"></textarea>
      <button type="submit" class="bg-primary text-white px-4 py-2 rounded-lg">Actualizar Categoría</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'; // Asegúrate de tener axios importado

export default {
  props: {
    restaurantId: {
      type: [String, Number],  // Acepta tanto string como número
      required: true
    },
    categoryId: {
      type: [String, Number],  // Acepta tanto string como número
      required: true
    }
  },
  data() {
    return {
      category: {
        name: '',
        description: ''
      },
    };
  },
  computed: {
    parsedRestaurantId() {
      return Number(this.restaurantId);  // Convertir la prop a número si es string
    },
    parsedCategoryId() {
      return Number(this.categoryId);  // Convertir la prop a número si es string
    }
  },
  async mounted() {
    await this.fetchCategory();
  },
  methods: {
    async fetchCategory() {
      try {
        if (!this.parsedCategoryId) {
          throw new Error('El ID de la categoría no está definido.');
        }
        const response = await this.$axios.get(`/restaurants/${this.parsedRestaurantId}/menu-categories/${this.parsedCategoryId}`);
        this.category = response.data;
      } catch (error) {
        console.error('Error obteniendo la categoría', error);
      }
    },
    async handleSubmit() {
      try {
        if (!this.parsedRestaurantId || !this.parsedCategoryId) {
          throw new Error('El ID del restaurante o la categoría no está definido.');
        }

        // Incluir el restaurant_id en los datos
        const categoryData = {
          name: this.category.name,
          description: this.category.description,
          restaurant_id: this.parsedRestaurantId,  // Añadir restaurant_id en el cuerpo
        };
        // Usar Axios globalmente con this.$axios
        await this.$axios.put(`/restaurants/${this.parsedRestaurantId}/menu-categories/${this.parsedCategoryId}`, categoryData);
        this.$router.push(`/restaurants/${this.parsedRestaurantId}`);
      } catch (error) {
        console.error('Error actualizando la categoría', error);
      }
    }
  }
};
</script>

<style scoped>
.create-category {
  max-width: 600px;
  margin: auto;
}
</style>

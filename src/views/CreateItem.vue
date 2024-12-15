<template>
  <div class="create-item bg-white shadow-lg p-8 rounded-lg mt-20">
    <h2 class="text-3xl font-bold mb-6 text-blue-900">Crear Plato</h2>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Selector de categoría -->
      <div>
        <label for="category" class="text-lg font-semibold text-blue-900 mb-2 block">Categoría</label>
        <select v-model="item.category_id" id="category" class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-900 focus:ring-blue-900" required>
          <option value="" disabled selected>Seleccione una categoría</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- Nombre del plato -->
      <div>
        <label for="name" class="text-lg font-semibold text-blue-900 mb-2 block">Nombre del Plato</label>
        <input
            v-model="item.name"
            id="name"
            type="text"
            placeholder="Nombre del plato"
            required
            class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-900 focus:ring-blue-900"
        />
      </div>

      <!-- Descripción del plato -->
      <div>
        <label for="description" class="text-lg font-semibold text-blue-900 mb-2 block">Descripción</label>
        <textarea
            v-model="item.description"
            id="description"
            placeholder="Descripción"
            class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-900 focus:ring-blue-900"
        ></textarea>
      </div>

      <!-- Precio del plato -->
      <div>
        <label for="price" class="text-lg font-semibold text-blue-900 mb-2 block">Precio (€)</label>
        <input
            v-model.number="item.price"
            id="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="Precio"
            required
            class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-900 focus:ring-blue-900"
        />
      </div>

      <!-- Subida de imagen -->
      <div>
        <label for="image" class="text-lg font-semibold text-blue-900 mb-2 block">Subir Imagen</label>
        <input type="file" id="image" @change="handleImageUpload" class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-900 focus:ring-blue-900" />
      </div>

      <!-- Selector de alérgenos -->
      <div>
        <AllergensSelector v-model="item.allergens" />
      </div>

      <!-- Botón de envío -->
      <button type="submit" class="w-full bg-orange-500 text-white px-4 py-3 rounded-lg text-lg font-bold hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all duration-200">
        Crear Plato
      </button>
    </form>
  </div>
</template>

<script>
import AllergensSelector from '../components/AllergensSelector.vue';

export default {
  components: {
    AllergensSelector,
  },
  data() {
    return {
      item: {
        name: '',
        description: '',
        price: '',
        category_id: null,
        image: null,
        allergens: [], // Este campo contiene los alérgenos seleccionados
      },
      categories: [],
    };
  },
  async mounted() {
    try {
      const restaurantId = this.$route.params.restaurantId;
      console.log('ID del restaurante:', restaurantId); // Debugging

      if (!restaurantId) {
        console.error('ID del restaurante no encontrado');
        return;
      }

      // Obtener las categorías del restaurante
      const response = await this.$axios.get(`/restaurants/${restaurantId}/menu-categories`);
      console.log('Categorías obtenidas:', response.data); // Debugging
      this.categories = response.data;

    } catch (error) {
      console.error('Error obteniendo las categorías', error);
    }
  },
  methods: {
    async handleSubmit() {
      try {
        const formData = new FormData();
        formData.append('name', this.item.name);
        formData.append('description', this.item.description);
        formData.append('price', this.item.price);
        formData.append('category_id', this.item.category_id);

        if (this.item.image) {
          formData.append('image', this.item.image);
        }

        // Verificar que el array de alérgenos tenga valores
        if (this.item.allergens.length > 0) {
          this.item.allergens.forEach((allergen, index) => {
            formData.append(`allergens[${index}]`, allergen);
          });
        }

        console.log('Datos a enviar:', formData); // Para verificar en el frontend

        // Crear el plato dentro de la categoría seleccionada
        const response = await this.$axios.post(`/menu-categories/${this.item.category_id}/menu-items`, formData);
        console.log('Plato creado:', response.data);

        // Redirigir al menú del restaurante tras crear el plato
        this.$router.push(`/restaurants/${this.$route.params.restaurantId}`);
      } catch (error) {
        console.error('Error creando el plato', error);
      }
    },
    handleImageUpload(event) {
      this.item.image = event.target.files[0];
    },
  },
};
</script>

<style scoped>
.create-item {
  max-width: 700px;
  margin: auto;
  background-color: #fff;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
}

.create-item h2 {
  color: #35455d;
}
</style>

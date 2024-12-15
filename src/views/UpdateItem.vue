<template>
  <div class="create-item bg-white shadow-lg p-8 rounded-lg mt-20">
    <h2 class="text-3xl font-bold mb-6 text-blue-900 mt-20">Actualizar Plato</h2>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Selector de categoría -->
      <div>
        <label for="category" class="text-lg font-semibold text-blue-900 mb-2 block">Categoría</label>
        <select v-model="item.category_id" id="category" class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-900 focus:ring-blue-900" required>
          <option value="" disabled>Seleccione una categoría</option>
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
            v-model="item.price"
            id="price"
            type="number"
            step="0.01"
            placeholder="Precio"
            required
            class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-900 focus:ring-blue-900"
        />
      </div>

      <!-- Subida de imagen -->
      <div>
        <label for="image" class="text-lg font-semibold text-blue-900 mb-2 block">Subir Imagen</label>
        <input type="file" id="image" @change="handleImageUpload" class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-900 focus:ring-blue-900" />
        <img v-if="item.image_url" :src="item.image_url" class="w-full h-40 object-cover mt-4 rounded-lg" alt="Imagen actual del plato" />
      </div>

      <!-- Selector de alérgenos -->
      <div>
        <AllergensSelector v-model="item.allergens" />

      </div>

      <!-- Botón de envío -->
      <button type="submit" class="w-full bg-blue-500 text-white px-4 py-3 rounded-lg text-lg font-bold hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200">
        Actualizar Plato
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
  props: {
    restaurantId: {
      type: [String, Number],
      required: true,
    },
    categoryId: {
      type: [String, Number],
      required: true,
    },
    itemId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      item: {
        name: '',
        description: '',
        price: '',
        category_id: null,
        image: null,
        allergens: [],
        image_url: null, // URL de la imagen actual
      },
      categories: [],
    };
  },
  async mounted() {
    try {
      console.log('Restaurant ID:', this.restaurantId); // Verificar el ID del restaurante
      console.log('Category ID:', this.categoryId); // Verificar el ID de la categoría
      console.log('Item ID:', this.itemId); // Verificar el ID del plato

      // Obtener las categorías del restaurante
      const categoriesResponse = await this.$axios.get(`/restaurants/${this.restaurantId}/menu-categories`);
      console.log('Categorías obtenidas:', categoriesResponse.data); // Depurar las categorías
      this.categories = categoriesResponse.data;

      // Obtener los datos del plato
      await this.fetchItem();
    } catch (error) {
      console.error('Error inicializando los datos:', error);
    }
  },
  methods: {
    async fetchItem() {
      try {
        console.log('Fetching item data...');

        // Obtener el plato desde el backend
        const response = await this.$axios.get(`/restaurants/${this.restaurantId}/menu-categories/${this.categoryId}/menu-items/${this.itemId}`);
        console.log('Datos del plato obtenidos:', response.data);

        // Asignar los datos del plato
        this.item = response.data;

        // Extraer los IDs de los alérgenos del plato
        this.item.allergens = response.data.allergens.map(allergen => allergen.id);

        // Verificar si los alérgenos están correctamente asignados
        console.log('Alérgenos seleccionados:', this.item.allergens);
      } catch (error) {
        console.error('Error obteniendo los datos del plato:', error);
      }
    }
    ,
    async handleSubmit() {
      try {
        console.log('Datos a enviar:', this.item); // Depurar los datos antes de enviar
        const formData = new FormData();
        formData.append('name', this.item.name);
        formData.append('description', this.item.description);
        formData.append('price', this.item.price);
        formData.append('category_id', this.item.category_id);
        if (this.item.image) formData.append('image', this.item.image); // Añadir la imagen si fue seleccionada
        this.item.allergens.forEach((allergen, index) => {
          formData.append(`allergens[${index}]`, allergen);
        });

        console.log('FormData para enviar:', formData); // Verificar el FormData antes de enviar

        // Actualizar el plato
        await this.$axios.put(`/restaurants/${this.restaurantId}/menu-categories/${this.categoryId}/menu-items/${this.itemId}`, formData);
        console.log('Plato actualizado con éxito.');
        this.$router.push(`/restaurants/${this.restaurantId}`);
      } catch (error) {
        console.error('Error actualizando el plato:', error);
      }
    },
    handleImageUpload(event) {
      this.item.image = event.target.files[0];
      console.log('Imagen seleccionada:', this.item.image); // Depurar la imagen seleccionada
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

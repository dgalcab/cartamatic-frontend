<template>
  <div class="menu-tab">
    <!-- Botones Crear Categoría y Crear Plato (solo visibles si el usuario está autenticado) -->
    <div class="flex justify-end space-x-4 mb-10" v-if="isAuthenticated">
      <button @click="createCategory" class="bg-secondary text-white px-4 py-2 rounded-lg mx-2">Crear Categoría</button>
      <button @click="createItem" class="bg-secondary text-white px-4 py-2 rounded-lg">Crear Plato</button>
    </div>

    <!-- Carrusel de Categorías con Swiper y Scrollbar -->
    <div class="justify-center relative">
      <swiper
          :slides-per-view="'auto'"
          :space-between="20"
          :scrollbar="{
          draggable: true,
        }"
          :modules="modules"
          class="mySwiper"
      >
        <!-- Swiper Slides generados dinámicamente con las categorías -->
        <swiper-slide
            v-for="category in categories"
            :key="category.id"
            @click="selectCategory(category)"
            :class="{
            'bg-orange-500 text-white': selectedCategory === category.id,
            'bg-primary text-white': selectedCategory !== category.id
          }"
            class="category-slide px-4 py-2 rounded-lg text-center cursor-pointer relative"
            style="width: auto;"
        >
          <!-- Iconos de Editar y Borrar para categorías, solo visibles si está logueado -->
          <div v-if="isAuthenticated" class="icon-container-category flex space-x-2">
            <button @click.stop="editCategory(category)" class="icon-btn" title="Editar">
              <i class="fas fa-edit text-gray-700"></i>
            </button>
            <button @click.stop="confirmDeleteCategory(category.id)" class="icon-btn" title="Borrar">
              <i class="fas fa-trash text-red-600"></i>
            </button>
          </div>

          <!-- Nombre de la categoría con margen condicional -->
          <div :class="isAuthenticated ? 'category-name-auth' : 'category-name'">{{ category.name }}</div>
        </swiper-slide>
      </swiper>
    </div>

    <!-- Título y Descripción de la Categoría Seleccionada -->
    <div v-if="selectedCategoryData" class="category-header text-center my-6">
      <h2 class="text-2xl font-bold uppercase text-blue-900">{{ selectedCategoryData.name }}</h2>
      <p class="text-gray-600 italic">{{ selectedCategoryData.description }}</p>
    </div>

    <!-- Lista de Platos -->
    <div v-if="filteredItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
      <div v-for="item in filteredItems" :key="item.id" class="menu-item bg-white shadow rounded-lg p-4 relative">
        <!-- Iconos de Editar y Borrar en su propio div -->
        <div v-if="isAuthenticated" class="action-icons flex justify-end mb-2">
          <button @click.stop="editItem(item, selectedCategory)" class="icon-btn" title="Editar">
            <i class="fas fa-edit text-gray-700"></i>
          </button>
          <button @click.stop="confirmDeleteItem(item.id)" class="icon-btn ml-2" title="Borrar">
            <i class="fas fa-trash text-red-600"></i>
          </button>
        </div>

        <!-- Nombre del plato y precio alineados correctamente debajo de los iconos -->
        <div :class="isAuthenticated ? 'item-name-auth' : 'item-name'" class="item-container flex justify-between items-center mb-2">
          <h3 class="item-name text-base font-bold text-blue-500 min-w-0 flex-grow pr-6">{{ item.name }}</h3>
          <p class="item-price text-primary font-bold whitespace-nowrap">{{ item.price }} €</p>
        </div>
        <p class="text-gray-600 italic">{{ item.description }}</p>
        <img v-if="item.image_url" :src="getImageUrl(item.image_url)" class="w-full h-32 object-cover mt-2 rounded-md" alt=""/>

        <!-- Alérgenos del plato -->
        <div class="mt-4">
          <img v-for="allergen in item.allergens" :key="allergen.id" :src="getAllergenIcon(allergen.name)" class="w-6 h-6 inline-block mx-1" alt=""/>
        </div>
      </div>
    </div>

    <div v-else class="text-gray-600 mt-5">No hay platos en esta categoría.</div>

    <!-- Alérgenos al final de la categoría -->
    <h2 class="text-2xl text-center mt-10 font-bold uppercase text-blue-900">Alérgenos /Allergens</h2>
    <div class="allergens-grid mt-8">
      <div v-for="allergen in allergensList" :key="allergen.id" class="text-center">
        <img :src="getAllergenIcon(allergen.name)" class="w-8 h-8 mx-auto" alt="Icono de alérgeno" />
        <p class="text-xs text-gray-600 mt-2">{{ allergen.name }}</p>
      </div>
    </div>

    <!-- Modal de Confirmación para Eliminar Categoría -->
    <div v-if="showDeleteCategoryModal" class="modal" :style="{ zIndex: 1000 }">
      <div class="modal-content">
        <h3>¿Estás seguro de que quieres eliminar esta categoría?</h3>
        <button @click="deleteCategory" class="bg-red-500 text-white px-4 py-2 rounded">Sí, eliminar</button>
        <button @click="closeCategoryModal" class="bg-gray-500 text-white px-4 py-2 rounded ml-4">Cancelar</button>
      </div>
    </div>

    <!-- Modal de Confirmación para Eliminar Plato -->
    <div v-if="showDeleteItemModal" class="modal">
      <div class="modal-content">
        <h3>¿Estás seguro de que quieres eliminar este plato?</h3>
        <button @click="deleteItem" class="bg-red-500 text-white px-4 py-2 rounded">Sí, eliminar</button>
        <button @click="closeItemModal" class="bg-gray-500 text-white px-4 py-2 rounded ml-4">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/scrollbar';
import apiClient from '/src/axios';

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    restaurantId: {
      type: Number,
      required: true,
    },
    categoryId: {
      type: Number, // Parámetro opcional para redirigir a una categoría específica
      required: false,
    },
  },
  data() {
    return {
      categories: [],
      selectedCategory: null,
      selectedCategoryData: null, // Guardar los datos de la categoría seleccionada
      isAuthenticated: false,
      modules: [Scrollbar],
      showDeleteCategoryModal: false,
      categoryIdToDelete: null,
      showDeleteItemModal: false,
      itemIdToDelete: null,
      allergensList: [], // Lista de alérgenos cargada desde la API
    };
  },
  computed: {
    filteredItems() {
      const category = this.categories.find(c => c.id === this.selectedCategory);
      return category ? category.items : [];
    },
  },
  async mounted() {
    this.checkAuthStatus();
    await this.fetchCategories();
    await this.fetchAllergens();

    // Si se proporciona una categoría por prop, seleccionarla
    if (this.categoryId) {
      this.selectedCategory = this.categoryId;
    } else if (this.categories.length > 0) {
      this.selectedCategory = this.categories[0].id;
    }
    this.updateSelectedCategoryData(); // Actualizar los datos de la categoría seleccionada
    this.scrollToTop();
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    checkAuthStatus() {
      const token = localStorage.getItem('auth_token');
      this.isAuthenticated = !!token;
    },
    async fetchCategories() {
      try {
        const response = await apiClient.get(`/restaurants/${this.restaurantId}/menu-categories`);
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    async fetchAllergens() {
      try {
        const response = await apiClient.get('/allergens');
        this.allergensList = response.data;
      } catch (error) {
        console.error('Error fetching allergens:', error);
      }
    },
    updateSelectedCategoryData() {
      this.selectedCategoryData = this.categories.find(c => c.id === this.selectedCategory);
    },
    getImageUrl(image_url) {
      return `http://localhost:8000/storage/${image_url}`;
    },
    getAllergenIcon(allergenName) {
      return `http://localhost:8000/storage/restaurants/allergens/${allergenName}.png`;
    },
    selectCategory(category) {
      this.selectedCategory = category.id;
      this.updateSelectedCategoryData();
    },
    createCategory() {
      this.$router.push({ name: 'CreateCategory', params: { restaurantId: this.restaurantId } });
    },
    createItem() {
      this.$router.push({
        name: 'CreateItem',
        params: { restaurantId: this.restaurantId, categoryId: this.selectedCategory },
      });
    },
    editCategory(category) {
      this.$router.push({ name: 'UpdateCategory', params: { restaurantId: this.restaurantId, categoryId: category.id } });
    },
    editItem(item) {
      this.$router.push({
        name: 'UpdateItem',
        params: {
          restaurantId: this.restaurantId,
          categoryId: this.selectedCategory,
          itemId: item.id,
        },
      });
    },
    confirmDeleteCategory(categoryId) {
      this.categoryIdToDelete = categoryId;
      this.showDeleteCategoryModal = true;
    },
    async deleteCategory() {
      try {
        await apiClient.delete(`/restaurants/${this.restaurantId}/menu-categories/${this.categoryIdToDelete}`);
        this.showDeleteCategoryModal = false;
        this.fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    },
    closeCategoryModal() {
      this.showDeleteCategoryModal = false;
    },
    confirmDeleteItem(itemId) {
      this.itemIdToDelete = itemId;
      this.showDeleteItemModal = true;
    },
    async deleteItem() {
      try {
        await this.$axios.delete(`/restaurants/${this.restaurantId}/menu-categories/${this.selectedCategory}/menu-items/${this.itemIdToDelete}`);
        this.showDeleteItemModal = false;
        this.fetchCategories();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    },
    closeItemModal() {
      this.showDeleteItemModal = false;
    },
  },
};
</script>

<style scoped>
.menu-tab {
  padding: 10px;
}

.menu-item {
  transition: transform 0.3s ease;
  position: relative;
}

.menu-item:hover {
  transform: translateY(-10px);
}

.category-header h2 {
  color: #35455d;
}

/* Div para los iconos de editar y borrar */
.action-icons {
  display: flex;
  justify-content: flex-end;
}

/* Div para nombre del plato y precio */
.item-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Botones de iconos */
.icon-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: #f0f0f0;
  transition: background-color 0.2s ease;
}

.icon-btn:hover {
  background-color: #e0e0e0;
}

.icon-btn[title]:hover::before {
  content: attr(title);
  position: absolute;
  bottom: 120%;
  background-color: #333;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  font-size: 12px;
  opacity: 0.8;
}


.allergens-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  padding: 1rem;
}

/* Estilo para alérgenos más pequeños en móviles */
@media (max-width: 768px) {
  .allergens-grid {
    grid-template-columns: repeat(7, 1fr);
    gap: 0.05rem;
    padding: 0;
  }
}
.swiper {
   margin-bottom: 20px;
   padding-bottom: 30px;
   position: relative;
 }

.swiper-scrollbar {
  background-color: #d47e2f;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 8px;
  margin-top: 10px;
}

.swiper-scrollbar-drag {
  background-color: #35455d;
  border-radius: 10px;
}

/* Estilos del modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
</style>

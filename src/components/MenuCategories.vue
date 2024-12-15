<!-- MenuCategory.vue -->
<template>
  <div class="menu-category">
    <h2 class="text-2xl font-bold mb-4">{{ category.name }}</h2>
    <p>{{ category.description }}</p>

    <!-- Mostrar todos los ítems de esta categoría -->
    <MenuItem
        v-for="item in category.items"
        :key="item.id"
        :item="item"
        :is-authenticated="isAuthenticated"
        @editItem="editItem"
        @deleteItem="deleteItem"
    />

    <!-- Solo los propietarios pueden agregar ítems -->
    <div v-if="isAuthenticated" class="mt-4">
      <button @click="addItem" class="bg-secondary text-white px-4 py-2 rounded-lg">Agregar Plato</button>
    </div>
  </div>
</template>

<script>
import MenuItem from './MenuItem.vue';

export default {
  props: ['category', 'isAuthenticated'],
  components: {
    MenuItem,
  },
  methods: {
    addItem() {
      this.$emit('addItem', this.category.id);
    },
    editItem(item) {
      this.$emit('editItem', item);
    },
    deleteItem(itemId) {
      this.$emit('deleteItem', itemId);
    },
  },
};
</script>

<style scoped>
.menu-category {
  border-bottom: 2px solid #ccc;
  margin-bottom: 2rem;
}
</style>

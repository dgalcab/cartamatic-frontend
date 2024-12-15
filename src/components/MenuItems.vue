<!-- MenuItem.vue -->
<template>
  <div class="menu-item flex justify-between p-4 border rounded shadow-lg">
    <div>
      <h3 class="text-lg font-semibold">{{ item.name }}</h3>
      <p>{{ item.description }}</p>
      <p><strong>Precio:</strong> {{ item.price }} €</p>
      <img v-if="item.image_url" :src="getImageUrl(item.image_url)" alt="Imagen del plato" class="w-32 h-32 rounded" />

      <!-- Mostrar los alérgenos -->
      <div v-if="item.allergens.length > 0" class="mt-2">
        <img v-for="allergen in item.allergens" :key="allergen.id" :src="getAllergenIcon(allergen.name)" alt="Icono de alérgeno" class="w-8 h-8 inline-block mx-1" />
      </div>
    </div>

    <!-- Solo propietarios pueden editar o eliminar -->
    <div v-if="isAuthenticated">
      <button @click="editItem" class="bg-blue-500 text-white px-4 py-2 rounded">Editar</button>
      <button @click="deleteItem" class="bg-red-500 text-white px-4 py-2 rounded ml-2">Eliminar</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['item', 'isAuthenticated'],
  methods: {
    getImageUrl(image_url) {
      return `http://localhost:8000/storage/${image_url}`;
    },
    getAllergenIcon(allergenName) {
      return `http://localhost:8000/storage/allergens/${allergenName}.png`;
    },
    editItem() {
      this.$emit('editItem', this.item);
    },
    deleteItem() {
      this.$emit('deleteItem', this.item.id);
    },
  },
};
</script>

<style scoped>
.menu-item {
  margin-bottom: 1.5rem;
}
</style>

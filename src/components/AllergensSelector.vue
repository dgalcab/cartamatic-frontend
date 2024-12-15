<template>
  <div>
    <h4 class="font-bold mb-2 text-blue-900">Seleccionar Alérgenos</h4>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <label v-for="allergen in allergensList" :key="allergen.id" class="flex items-center space-x-2">
        <!-- Checkbox -->
        <input
            type="checkbox"
            :value="allergen.id"
            @change="toggleAllergen(allergen.id)"
            :checked="isSelected(allergen.id)"
            class="form-checkbox h-5 w-5 text-orange-500"
        />

        <!-- Icono del alérgeno -->
        <img :src="getAllergenIcon(allergen.name)" class="w-8 h-8" alt="Icono de alérgeno" />

        <!-- Nombre del alérgeno -->
        <span class="font-bold capitalize text-sm">{{ allergen.name }}</span>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Array,
      default: () => [],  // Si no se pasa, por defecto será un array vacío
    },
  },
  data() {
    return {
      allergensList: []  // Lista completa de alérgenos cargada desde la API
    };
  },
  async mounted() {
    try {
      const response = await this.$axios.get('/allergens');
      this.allergensList = response.data;
    } catch (error) {
      console.error('Error obteniendo los alérgenos', error);
    }
  },
  methods: {
    toggleAllergen(allergenId) {
      let updatedAllergens = [...this.modelValue];
      if (this.isSelected(allergenId)) {
        updatedAllergens = updatedAllergens.filter(id => id !== allergenId);
      } else {
        updatedAllergens.push(allergenId);
      }
      this.$emit('update:modelValue', updatedAllergens);  // Actualizar el v-model
    },
    isSelected(allergenId) {
      return Array.isArray(this.modelValue) && this.modelValue.includes(allergenId);  // Verificar que modelValue es un array antes de usar includes
    },
    getAllergenIcon(allergenName) {
      return `http://localhost:8000/storage/restaurants/allergens/${allergenName}.png`;
    }
  }
};
</script>

<style scoped>
.form-checkbox {
  accent-color: #d47e2f; /* Color naranja corporativo */
}
.text-sm {
  font-size: 0.875rem; /* Ajusta el tamaño de la fuente para que sea ligeramente más pequeño */
}
</style>

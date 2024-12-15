<template>
  <div class="min-h-screen flex flex-col bg-primary">
    <div class="flex-grow flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 class="text-2xl font-bold text-center mb-6">Crear una cuenta</h1>

        <form @submit.prevent="register">
          <div class="mb-4">
            <label for="name" class="block text-gray-700">Nombre Completo</label>
            <input
                v-model="name"
                type="text"
                id="name"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-secondary"
                placeholder="Ingresa tu nombre"
                required
            />
          </div>

          <div class="mb-4">
            <label for="email" class="block text-gray-700">Correo Electrónico</label>
            <input
                v-model="email"
                type="email"
                id="email"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-secondary"
                placeholder="Ingresa tu correo"
                required
            />
          </div>

          <div class="mb-4">
            <label for="password" class="block text-gray-700">Contraseña</label>
            <input
                v-model="password"
                type="password"
                id="password"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-secondary"
                placeholder="Ingresa una contraseña"
                required
            />
          </div>

          <div class="mb-4">
            <label for="confirmPassword" class="block text-gray-700">Confirmar Contraseña</label>
            <input
                v-model="confirmPassword"
                type="password"
                id="confirmPassword"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-secondary"
                placeholder="Confirma tu contraseña"
                required
            />
          </div>

          <!-- Mostrar el mensaje de error si existe -->
          <p v-if="errorMessage" class="text-red-500 text-center mb-4">{{ errorMessage }}</p>

          <!-- Botón para enviar el formulario -->
          <button
              type="submit"
              class="w-full bg-secondary text-white py-2 rounded-lg hover:bg-opacity-80"
          >
            Darse de Alta
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '/src/axios.js'; // Importamos la configuración de Axios

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: '', // Para mostrar errores de validación o errores generales
    };
  },
  methods: {
    async register() {
      // Verificamos si las contraseñas coinciden
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Las contraseñas no coinciden.';
        return;
      }

      try {
        console.log("Enviando solicitud de registro..."); // Log para depuración

        // Enviamos la solicitud de registro a la API
        const response = await apiClient.post('http://localhost:8000/api/register', {
          name: this.name,
          email: this.email,
          password: this.password,
        });

        console.log("Respuesta del servidor:", response); // Log para verificar la respuesta

        // Verifica si la respuesta fue exitosa (debería devolver un status 201)
        if (response.status === 201) {
          // Si el registro es exitoso, redirigimos a la pantalla de confirmación
          this.$router.push({ name: 'RegisterSuccess' });
        } else {
          this.errorMessage = 'Error inesperado. Intenta de nuevo.';
          console.log("Error inesperado con estado diferente de 201.");
        }

      } catch (error) {
        console.log("Error capturado:", error); // Log para depurar cualquier error

        // Manejamos los errores de validación o de otro tipo
        if (error.response && error.response.data.errors) {
          const errors = Object.values(error.response.data.errors).flat();
          this.errorMessage = errors.join(' ');
          console.log("Errores de validación:", this.errorMessage); // Log para los errores de validación
        } else {
          this.errorMessage = 'Error al crear la cuenta. Por favor, intenta de nuevo.';
          console.log("Error al crear la cuenta:", error.response ? error.response.data : error); // Log para errores generales
        }
      }
    },
  },
};
</script>

<style scoped>
/* Estilos personalizados si lo necesitas */
</style>

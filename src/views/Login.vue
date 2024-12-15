<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
      <h1 class="text-4xl font-bold text-center mb-6 text-primary">Iniciar Sesión</h1>

      <!-- Formulario de login -->
      <form @submit.prevent="handleLogin">
        <!-- Campo de Correo Electrónico -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input
              id="email"
              v-model="email"
              type="email"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
              required
          />
        </div>

        <!-- Campo de Contraseña -->
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
              id="password"
              v-model="password"
              type="password"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
              required
          />
        </div>

        <!-- Botón de Iniciar Sesión -->
        <div class="text-center">
          <button type="submit" class="btn-primary w-full">Iniciar Sesión</button>
        </div>
      </form>

      <!-- Mensaje de error si las credenciales son incorrectas -->
      <p v-if="errorMessage" class="mt-4 text-sm text-red-500 text-center">{{ errorMessage }}</p>

      <!-- Enlace para restablecer contraseña -->
      <p class="mt-4 text-sm text-gray-600 text-center">
        <router-link to="/forgot-password" class="text-secondary hover:underline">¿Has olvidado tu contraseña?</router-link>
      </p>

      <!-- Enlace para usuarios no registrados -->
      <p class="mt-4 text-sm text-gray-600 text-center">
        ¿No tienes una cuenta? <router-link to="/register" class="text-secondary hover:underline">Regístrate</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '/src/axios';  // Usamos tu instancia personalizada de Axios

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const router = useRouter();  // Para manejar la redirección después del login

    const handleLogin = async () => {
      try {
        console.log("Intentando iniciar sesión con:", email.value, password.value);

        // Realizamos la solicitud de login utilizando Axios personalizado
        const response = await apiClient.post('/login', {
          email: email.value,
          password: password.value,
        });

        console.log("Respuesta de la API:", response);

        // Verificamos que la respuesta contenga el access_token y el usuario
        const token = response.data.access_token;
        const user = response.data.user;

        if (!token || !user) {
          errorMessage.value = 'Error: No se ha recibido un token válido o el usuario.';
          return;
        }

        // Guardar el token, el nombre del usuario y el ID en localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_name', user.name);
        localStorage.setItem('user_id', user.id);  // Guardar el user_id en localStorage

        console.log("Usuario autenticado correctamente:", user.name);

        // Redirigir a la página de restaurantes
        router.push('/restaurants');
      } catch (error) {
        console.log("Error durante el inicio de sesión:", error);

        if (error.response && error.response.data.message) {
          errorMessage.value = error.response.data.message;
          console.log("Mensaje de error del servidor:", error.response.data.message);
        } else {
          errorMessage.value = 'Credenciales incorrectas. Por favor, intenta de nuevo.';
        }
      }
    };

    return {
      email,
      password,
      errorMessage,
      handleLogin,
    };
  },
};
</script>

<style scoped>
/* Estilos personalizados */
.bg-white {
  background-color: #ffffff;
}

.shadow-lg {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background-color: #d47e2f;
  color: white;
  padding: 0.75rem 1.5rem;
  font-weight: bold;
  border-radius: 0.375rem;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #bf691e;
}

.text-secondary {
  color: #d47e2f;
}
</style>

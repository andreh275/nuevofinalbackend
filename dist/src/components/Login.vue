<template>
  <div class="login-container">
    <div class="form-container">
      <h1>Registro</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email:</label>
          <input v-model="email" type="email" id="email" placeholder="Ingrese su email" required />
        </div>
        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input v-model="password" type="password" id="password" placeholder="Ingrese su contraseña" required />
        </div>
        <button type="submit" class="login-submit">Iniciar sesión</button>
      </form>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { postData } from '../services/apiClient';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2'; // Importamos SweetAlert2

const email = ref('');
const password = ref('');
const error = ref(null);

const router = useRouter();

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = 'Por favor ingrese el correo y la contraseña.';
    return;
  }

  try {
    const response = await postData('/usuarios/login', { email: email.value, contraseña: password.value });
    localStorage.setItem('token', response.token);

    // Mostrar la notificación con SweetAlert2
    Swal.fire({
      title: '¡Inicio de sesión exitoso!',
      text: 'Bienvenido a tu plataforma',
      icon: 'success',
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#2575fc',
      background: '#fff',
      backdrop: `
        rgba(0,0,123,0.4)
        url("https://sweetalert2.github.io/images/nyan-cat.gif")
        left top
        no-repeat
      `
    });

    router.replace('/Home'); // Redireccionamos al inicio
  } catch (err) {
    error.value = 'Error al iniciar sesión: ' + (err.response?.data?.msg || err.message);

    // Notificación de error con SweetAlert2
    Swal.fire({
      title: 'Error al iniciar sesión',
      text: 'Por favor, verifica tus credenciales',
      icon: 'error',
      confirmButtonText: 'Intentar de nuevo',
      confirmButtonColor: '#ff4d4d'
    });
  }
};
</script>

<style scoped>
/* Estilo general */
body, html {
  height: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Open Sans', sans-serif;
  background: linear-gradient(to right, #6a11cb, #2575fc); 
}

/* Contenedor principal */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-image: url('https://i.pinimg.com/originals/b4/6c/d0/b46cd069a1837a0a881fe9b45bae456f.gif'); 
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  z-index: 1;
}

/* Efecto overlay */
.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  z-index: -1;
  backdrop-filter: blur(5px);
}

/* Contenedor del formulario */
.form-container {
  background: rgba(255, 255, 255, 0.8);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 16px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
  border: solid 2px #000;
}

/* Estilo de encabezado */
h1 {
  margin-bottom: 20px;
  color: #000;
  font-size: 28px;
  font-weight: bold;
}

/* Campos de formulario */
.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

input {
  width: 100%;
  padding: 12px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  background: #f9f9f9;
  transition: 0.3s ease;
}

input:focus {
  border-color: #6a11cb;
  box-shadow: 0 0 8px rgba(106, 17, 203, 0.3);
  outline: none;
}

/* Botón de enviar */
.login-submit {
  width: 100%;
  padding: 15px;
  background: linear-gradient(to right, #6a11cb, #2575fc);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
}

.login-submit:hover {
  background: linear-gradient(to right, #2575fc, #6a11cb);
}

/* Mensaje de error */
.error-message {
  color: red;
  margin-top: 15px;
  font-size: 14px;
  font-weight: bold;
}
</style>

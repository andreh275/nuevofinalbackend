<template>
  <div class="dashboard-container">
   
    <section class="welcome-section">
      <h1>Bienvenidos a Nuestra Empresa</h1>
      <p>
        Nos enorgullece recibirte en nuestro espacio. Aquí puedes explorar nuestras
        funcionalidades y conocer más sobre nosotros.
      </p>
    </section>

    
    <section class="employees-section">
      <h2>Usuarios Destacados del Mes</h2>
      <div class="employees-grid">
        <div class="employee-card" v-for="employee in employees" :key="employee.id">
          <img :src="employee.photo" alt="Empleado" class="employee-photo" />
          <div class="employee-info">
            <h3>{{ employee.name }}</h3>
            <p>{{ employee.position }}</p>
          </div>
        </div>
      </div>
    </section>

    
    <section class="cards-section">
      <div class="cards-container">
        <q-card class="my-card" v-for="card in cards" :key="card.route">
          <q-img :src="card.image" class="card-img">
            <div class="absolute-bottom text-h6 text-white">
              <q-btn :to="card.route" class="card-btn" flat>{{ card.label }}</q-btn>
            </div>
          </q-img>
        </q-card>
      </div>
    </section>

    
    <div class="logout-container">
      <q-btn 
        class="logout-button" 
        label="Cerrar sesión" 
        icon="logout" 
        color="negative" 
        @click="handleLogout" 
        flat
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';


const employees = ref([
  {
    id: 1,
    name: "Juan Pérez",
    position: "Gerente de Ventas",
    photo: "https://i.pinimg.com/736x/08/bd/cc/08bdcc2cc2fa5fc4e3ceb169accc6bed.jpg",
  },
  {
    id: 2,
    name: "Ana López",
    position: "Diseñadora Gráfica",
    photo: "https://i.pinimg.com/736x/b3/4a/8b/b34a8b4cfdae339e48dce304a6be1ec1.jpg",
  },
  {
    id: 3,
    name: "Carlos Gómez",
    position: "Desarrollador Web",
    photo: "https://i.pinimg.com/736x/a5/aa/6e/a5aa6e012248c71689fa17b043ade159.jpg",
  },
]);
const router = useRouter();
const handleLogout = () => {
  console.log("Sesión cerrada");
  router.push("/");  // Redirige al inicio
};
</script>

<style scoped>
/* Contenedor principal */
.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Asegura que el contenedor ocupe todo el alto de la pantalla */
}

/* Secciones de la página */
.welcome-section, .employees-section, .cards-section {
  padding: 40px 20px;
  text-align: center;
}

.welcome-section h1, .employees-section h2 {
  font-size: 36px;
  margin-bottom: 15px;
  font-weight: 600;
  color: #4a90e2;
}

.welcome-section p, .employees-section p {
  font-size: 18px;
  color: #555;
  line-height: 1.6;
  max-width: 800px;
  margin: auto;
}

/* Empleados destacados */
.employees-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.employee-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
  padding: 15px;
}

.employee-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.employee-photo {
  border-radius: 50%;
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
}

.employee-info h3 {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.employee-info p {
  font-size: 14px;
  color: #777;
}

/* Cards */
.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.my-card {
  width: 200px;
  height: 250px;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.my-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
}

.card-img {
  width: 100%;
  height: 100%;
}

.card-btn {
  width: 100%;
  text-align: center;
  color: #fff;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0;
}

.card-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

/* Contenedor para el botón de Cerrar sesión */
.logout-container {
  display: flex;
  justify-content: center; /* Centra el botón */
  margin-top: 30px; /* Separación entre las cards y el botón */
}

.logout-button {
  width: 180px;
  font-weight: bold;
  background-color: #e74c3c;
  color: white;
}
</style>

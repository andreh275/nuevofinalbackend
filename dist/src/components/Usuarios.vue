<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>Menú</q-toolbar-title>
      </q-toolbar>
    </q-header>

  
    <q-page-container>
      <div class="q-pa-md">
        <q-btn
          label="Añadir Usuario"
          color="primary"
          class="q-mb-md"
          @click="mostrarFormulario = !mostrarFormulario"
        />

        <q-form v-if="mostrarFormulario" @submit.prevent="guardarUsuario" class="q-gutter-md">
          <q-input
            v-model="nuevoUsuario.email"
            label="Email"
            outlined
            required
          />
          <q-input
            v-model="nuevoUsuario.contraseña"
            label="Contraseña"
            type="password"
            outlined
            required
          />
          <q-select
            v-model="nuevoUsuario.estado"
            :options="estadoOptions"
            label="Estado"
            outlined
            required
            map-options
            emit-value
          />
          <div>
            <q-btn label="Guardar" type="submit" color="primary" class="q-mr-sm" />
            <q-btn label="Cancelar" type="button" color="negative" @click="cancelarEdicion" />
          </div>
        </q-form>

        <q-table
          title="Usuarios"
          :rows="usuarios"
          :columns="columns"
          row-key="id"
          class="q-mt-md"
        >
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-badge
                :color="props.row.estado === 1 ? 'green' : 'red'"
                :label="props.row.estado === 1 ? 'Activo' : 'Inactivo'"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-opciones="props">
            <q-td :props="props">
              <q-btn
                dense
                flat
                icon="edit"
                color="primary"
                @click="editarUsuario(props.row)"
              />
              <q-btn
                dense
                flat
                :icon="props.row.estado === 1 ? 'toggle_off' : 'toggle_on'"
                :color="props.row.estado === 1 ? 'negative' : 'positive'"
                @click="cambiarEstadoUsuario(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getData, postData, putData } from "../services/apiClient";

const leftDrawerOpen = ref(false);
const router = useRouter();

const mostrarFormulario = ref(false);
const nuevoUsuario = ref({
  email: "",
  contraseña: "",
  estado: 1,
});
const usuarioEditando = ref(null);

const estadoOptions = [
  { label: "Activo", value: 1 },
  { label: "Inactivo", value: 0 },
];


const columns = [
  { 
    name: "email", 
    align: "left", 
    label: "Email", 
    field: "email", 
    sortable: true 
  },
  { 
    name: "estado", 
    align: "center", 
    label: "Estado", 
    field: "estado", 
    sortable: true 
  },
  { 
    name: "opciones", 
    align: "center", 
    label: "Opciones", 
    sortable: false 
  },
];



const usuarios = ref([]);

onMounted(async () => {
  await cargarUsuarios();
});

const cargarUsuarios = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await getData("/usuarios/usuarios", token);
    usuarios.value = response.usuarios;
  } catch (error) {
    console.error("Error al cargar los usuarios:", error);
  }
};



const guardarUsuario = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (usuarioEditando.value) {
      const datosActualizados = {
        email: nuevoUsuario.value.email,
        estado: nuevoUsuario.value.estado
      };
      
      
      if (nuevoUsuario.value.contraseña) {
        datosActualizados.contraseña = nuevoUsuario.value.contraseña;
      }
      
      await putData(
        `/usuarios/modificar/${usuarioEditando.value._id}`, 
        datosActualizados,
        token
      );
    } else {
      await postData("/usuarios", nuevoUsuario.value, token);
    }
    
    nuevoUsuario.value = { email: "", contraseña: "", estado: 1 };
    usuarioEditando.value = null;
    mostrarFormulario.value = false;
    await cargarUsuarios();
  } catch (error) {
    console.error("Error al guardar el usuario:", error);
  }
};


const editarUsuario = (usuario) => {
  nuevoUsuario.value = {
    email: usuario.email,
    contraseña: usuario.contraseña || '', 
    estado: usuario.estado,
    _id: usuario._id 
  };
  usuarioEditando.value = usuario;
  mostrarFormulario.value = true;
};


const cambiarEstadoUsuario = async (usuario) => {
  try {
    const token = localStorage.getItem("authToken");
    const nuevoEstado = usuario.estado === 1 ? 0 : 1;
    await putData(`/usuarios/usuario/${usuario.estado === 1 ? 'inactivar' : 'activar'}/${usuario._id}`, { estado: nuevoEstado }, token);
    await cargarUsuarios();
  } catch (error) {
    console.error("Error al cambiar el estado del usuario:", error);
  }
};

const cancelarEdicion = () => {
  nuevoUsuario.value = { email: "", contraseña: "", estado: 1 };
  usuarioEditando.value = null;
  mostrarFormulario.value = false;
};

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const navigateTo = (route) => {
  router.push(route);
};
</script>

<style scoped>
.q-drawer {
  min-width: 250px;
}
</style>
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
          label="Añadir Categoría"
          color="primary"
          class="q-mb-md"
          @click="mostrarFormulario = !mostrarFormulario"
        />

        
        <q-form v-if="mostrarFormulario" @submit.prevent="guardarCategoria" class="q-gutter-md">
          <q-input
            v-model="nuevaCategoria.descripcion"
            label="Descripción"
            outlined
            required
          />
          <q-select
            v-model="nuevaCategoria.estado"
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
          title="Categorías"
          :rows="categorias"
          :columns="columns"
          row-key="id"
          class="q-mt-md"
        >
         
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-badge
                :color="props.row.estado === 1 ? 'green' : 'red'"
                :label="props.row.estado === 1 ? 'Activa' : 'Inactiva'"
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
                @click="editarCategoria(props.row)"
              />
              <q-btn
                dense
                flat
                :icon="props.row.estado === 1 ? 'toggle_off' : 'toggle_on'"
                :color="props.row.estado === 1 ? 'negative' : 'positive'"
                @click="cambiarEstadoCategoria(props.row)"
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
const nuevaCategoria = ref({
  descripcion: "",
  estado: 1, 
});
const categoriaEditando = ref(null);


const estadoOptions = [
  { label: "Activa", value: 1 },
  { label: "Inactiva", value: 0 },
];


const columns = [
  { name: "descripcion", align: "left", label: "Descripción", field: "descripcion", sortable: true },
  { name: "estado", align: "center", label: "Estado", field: "estado", sortable: true },
  { name: "opciones", align: "center", label: "Opciones", sortable: false },
];


const categorias = ref([]);


onMounted(async () => {
  await cargarCategorias();
});


const cargarCategorias = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await getData("/categorias/categorias", token);
    categorias.value = response.categorias;
  } catch (error) {
    console.error("Error al cargar las categorías:", error);
  }
};


const guardarCategoria = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (categoriaEditando.value) {
      
      await putData(`/categorias/categoria/${categoriaEditando.value._id}`, nuevaCategoria.value, token);
    } else {
     
      await postData("/categorias", nuevaCategoria.value, token);
    }
    
    nuevaCategoria.value = { descripcion: "", estado: 1 };
    categoriaEditando.value = null;
    mostrarFormulario.value = false;
    await cargarCategorias();
  } catch (error) {
    console.error("Error al guardar la categoría:", error);
  }
};


const editarCategoria = (categoria) => {
  nuevaCategoria.value = { ...categoria };
  categoriaEditando.value = categoria;
  mostrarFormulario.value = true;
};


const cambiarEstadoCategoria = async (categoria) => {
  try {
    const token = localStorage.getItem("authToken");
    const nuevoEstado = categoria.estado === 1 ? 0 : 1; 
    await putData(`/categorias/categoria/${categoria._id}`, { estado: nuevoEstado }, token);
    await cargarCategorias(); 
  } catch (error) {
    console.error("Error al cambiar el estado de la categoría:", error);
  }
};


const cancelarEdicion = () => {
  nuevaCategoria.value = { descripcion: "", estado: 1 };
  categoriaEditando.value = null;
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
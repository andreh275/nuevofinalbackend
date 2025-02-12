<template>
  <q-layout view="hHh lpR fFf">
    
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>Menú</q-toolbar-title>
      </q-toolbar>
    </q-header>

   
    

    <q-page-container>
      <div>
        <q-table
          title="Lista de Artículos"
          :rows="articulos"
          :columns="columns"
          row-key="id"
        >
          <template v-slot:body-cell-imagen="props">
            <q-td :props="props" class="q-pa-sm">
              <q-img :src="props.row.imagen" width="50px" />
            </q-td>
          </template>

          <template v-slot:body-cell-estado="props">
            <q-td :props="props" class="q-pa-sm">
              <span
                style="color: white; padding: 5px;"
                :style="{
                  backgroundColor:
                    props.row.estado === 1 ? 'green' : 'red',
                }"
              >
                {{ props.row.estado === 1 ? 'Activo' : 'Inactivo' }}
              </span>
            </q-td>
          </template>

          <template v-slot:body-cell-opciones="props">
            <q-td :props="props" class="q-pa-sm">
              <q-btn flat round icon="edit" @click="openEditModal(props.row)" />
              <q-btn
                v-if="props.row.estado === 1"
                flat
                round
                icon="close"
                @click="inactivarArticulo(props.row._id)"
              />
              <q-btn
                v-else
                flat
                round
                icon="check"
                @click="activarArticulo(props.row._id)"
              />
            </q-td>
          </template>
        </q-table>

        
        <q-btn color="primary" label="Agregar Artículo" @click="openAddModal" />

      
        <q-dialog v-model="modalOpen">
          <q-card>
            <q-card-section>
              <div class="text-h6">{{ isEditMode ? 'Editar Artículo' : 'Agregar Artículo' }}</div>
            </q-card-section>

            <q-card-section>
              <q-input v-model="form.nombre" label="Nombre" />
              <q-input v-model="form.precio" label="Precio" type="number" />
              <q-input v-model="form.stock" label="Stock" type="number" />
              <q-input v-model="form.imagen" label="Imagen (URL)" />
              <q-input v-model="form.categoria" label="Categoría" />
              <q-select
                v-model="form.estado"
                :options="estadoOptions"
                label="Estado"
                map-options
                emit-value
              />
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="negative" @click="closeModal" />
              <q-btn flat label="Guardar" color="positive" @click="saveArticulo" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getData, postData, putData } from '../services/apiClient';

const router = useRouter();
const leftDrawerOpen = ref(false);
const modalOpen = ref(false);
const isEditMode = ref(false);
const form = ref({
  nombre: '',
  precio: 0,
  stock: 0,
  imagen: '',
  categoria: '',
  estado: 1,
});
const estadoOptions = [
  { label: 'Activo', value: 1 },
  { label: 'Inactivo', value: 0 },
];
const articulos = ref([]);

const columns = [
  { name: 'nombre', align: 'center', label: 'Nombre', field: 'nombre', sortable: true },
  { name: 'precio', align: 'center', label: 'Precio', field: 'precio', sortable: true },
  { name: 'stock', align: 'center', label: 'Stock', field: 'stock', sortable: true },
  { name: 'imagen', align: 'center', label: 'Imagen', field: 'imagen', sortable: false },
  { name: 'categoria', align: 'center', label: 'Categoría', field: 'categoria', sortable: true },
  { name: 'estado', align: 'center', label: 'Estado', field: 'estado', sortable: true },
  { name: 'opciones', align: 'center', label: 'Opciones', sortable: false },
];

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const openAddModal = () => {
  isEditMode.value = false;
  form.value = {
    nombre: '',
    precio: 0,
    stock: 0,
    imagen: '',
    categoria: '',
    estado: 1,
  };
  modalOpen.value = true;
};

const openEditModal = (articulo) => {
  isEditMode.value = true;
  form.value = { ...articulo };
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
};

const saveArticulo = async () => {
  try {
    const token = localStorage.getItem('apiClient');
    if (isEditMode.value) {
      await putData(`/articulos/articulo/${form.value._id}`, form.value, token);
    } else {
      await postData('/articulos', form.value, token);
    }
    closeModal();
    loadArticulos();
  } catch (error) {
    console.error('Error al guardar el artículo:', error);
  }
};

const loadArticulos = async () => {
  try {
    const token = localStorage.getItem('apiClient');
    const response = await getData('/articulos/articulos', token);
    articulos.value = response.articulos || response;
  } catch (error) {
    console.error('Error al cargar los artículos:', error);
  }
};

const activarArticulo = async (id) => {
  try {
    const token = localStorage.getItem('apiClient');
    await putData(`/articulos/activar/${id}`, {}, token);
    loadArticulos();
  } catch (error) {
    console.error('Error al activar artículo:', error);
  }
};

const inactivarArticulo = async (id) => {
  try {
    const token = localStorage.getItem('apiClient');
    await putData(`/articulos/inactivar/${id}`, {}, token);
    loadArticulos();
  } catch (error) {
    console.error('Error al inactivar artículo:', error);
  }
};

onMounted(() => {
  loadArticulos();
});
</script>

<style scoped>
.q-drawer {
  min-width: 250px;
}
</style>
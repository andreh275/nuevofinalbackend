<template>
    <q-layout view="hHh lpR fFf">
      
      <q-header elevated class="bg-primary text-white">
        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
          <q-toolbar-title>Proveedores</q-toolbar-title>
        </q-toolbar>
      </q-header>
  
      
  
      
      <q-page-container>
        <div>
          <q-table
            title="Lista de Proveedores"
            :rows="proveedores"
            :columns="columns"
            row-key="id"
          >
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
                  @click="inactivarProveedor(props.row._id)"
                />
                <q-btn
                  v-else
                  flat
                  round
                  icon="check"
                  @click="activarProveedor(props.row._id)"
                />
              </q-td>
            </template>
          </q-table>
  
          
          <q-btn color="primary" label="Agregar Proveedor" @click="openAddModal" />
  
         
          <q-dialog v-model="modalOpen">
            <q-card>
              <q-card-section>
                <div class="text-h6">{{ isEditMode ? 'Editar Proveedor' : 'Agregar Proveedor' }}</div>
              </q-card-section>
  
              <q-card-section>
                <q-input v-model="form.nombre" label="Nombre" />
                <q-input v-model="form.identificacion" label="Identificación" type="number" />
                <q-input v-model="form.direccion" label="Dirección" />
                <q-input v-model="form.telefono" label="Teléfono" type="number" />
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
                <q-btn flat label="Guardar" color="positive" @click="saveProveedor" />
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
    identificacion: 0,
    direccion: '',
    telefono: 0,
    tipo: 2, 
    estado: 1,
  });
  const estadoOptions = [
    { label: 'Activo', value: 1 },
    { label: 'Inactivo', value: 0 },
  ];
  const proveedores = ref([]);
  
  const columns = [
    { name: 'nombre', align: 'center', label: 'Nombre', field: 'nombre', sortable: true },
    { name: 'identificacion', align: 'center', label: 'Identificación', field: 'identificacion', sortable: true },
    { name: 'direccion', align: 'center', label: 'Dirección', field: 'direccion', sortable: true },
    { name: 'telefono', align: 'center', label: 'Teléfono', field: 'telefono', sortable: true },
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
      identificacion: 0,
      direccion: '',
      telefono: 0,
      tipo: 2, 
      estado: 1,
    };
    modalOpen.value = true;
  };
  
  const openEditModal = (proveedor) => {
    isEditMode.value = true;
    form.value = { ...proveedor };
    modalOpen.value = true;
  };
  
  const closeModal = () => {
    modalOpen.value = false;
  };
  
  const saveProveedor = async () => {
    try {
      const token = localStorage.getItem('apiClient');
      if (isEditMode.value) {
        await putData(`/terceros/tercero/${form.value._id}`, form.value, token);
      } else {
        await postData('/terceros', form.value, token);
      }
      closeModal();
      loadProveedores();
    } catch (error) {
      console.error('Error al guardar el proveedor:', error);
    }
  };
  
  const loadProveedores = async () => {
    try {
      const token = localStorage.getItem('apiClient');
      const response = await getData('/terceros/tipos/proveedor', token);
  
   
      proveedores.value = response.terceros || []; 
    } catch (error) {
      console.error('Error al cargar los proveedores:', error);
    }
  };
  
  
  
  const activarProveedor = async (id) => {
    try {
      const token = localStorage.getItem('apiClient');
      await putData(`/terceros/activar/${id}`, {}, token);
      loadProveedores();
    } catch (error) {
      console.error('Error al activar proveedor:', error);
    }
  };
  
  const inactivarProveedor = async (id) => {
    try {
      const token = localStorage.getItem('apiClient');
      await putData(`/terceros/inactivar/${id}`, {}, token);
      loadProveedores();
    } catch (error) {
      console.error('Error al inactivar proveedor:', error);
    }
  };
  
  onMounted(() => {
    loadProveedores();
  });
  </script>
  
  <style scoped>
  .q-drawer {
    min-width: 250px;
  }
  </style>
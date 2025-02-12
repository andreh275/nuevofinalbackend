<template>
    <q-page padding>
      <div class="text-h4 text-primary text-center q-mb-lg">Gestión de Inventario - Devoluciones de Salida</div>
  
      <div class="flex justify-between q-mb-md">
        <q-btn
          color="primary"
          label="Nueva Devolución"
          icon="inventory"
          class="q-px-md"
          @click="openEntryModal"
        />
      </div>
  
      <q-dialog v-model="showModal" persistent maximized>
        <q-card class="column" style="width: 900px; max-width: 95vw;">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">{{ isEditMode ? 'Editar Devolución' : 'Nueva Devolución' }}</div>
            <q-btn flat round icon="close" v-close-popup class="absolute-right" />
          </q-card-section>
  
          <q-card-section class="q-pa-md">
            <q-form @submit.prevent="submitEntry" class="q-gutter-md">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="entryForm.invoiceNumber"
                    label="Número de Factura"
                    filled
                    :rules="[val => !!val || 'Número de factura requerido']"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="entryForm.date"
                    label="Fecha"
                    type="date"
                    filled
                    :rules="[val => !!val || 'Fecha requerida']"
                  />
                </div>
              </div>
  
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-select
                    v-model="selectedProduct"
                    label="Buscar Producto"
                    :options="availableProducts"
                    option-value="_id"
                    option-label="nombre"
                    filled
                    use-input
                    hide-selected
                    fill-input
                    input-debounce="300"
                    @filter="filterProducts"
                    @update:model-value="addProductToEntry"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section>No se encontraron productos</q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
              </div>
  
              <q-table
                :rows="entryForm.products"
                :columns="productColumns"
                row-key="id"
                flat
                bordered
              >
                <template v-slot:body-cell-quantity="props">
                  <q-td :props="props">
                    <q-input
                      v-model.number="props.row.quantity"
                      type="number"
                      dense
                      filled
                      min="1"
                      @input="recalculateTotals"
                    />
                  </q-td>
                </template>
  
                <template v-slot:body-cell-price="props">
                  <q-td :props="props">
                    <q-input
                      v-model.number="props.row.price"
                      type="number"
                      dense
                      filled
                      min="0"
                      @input="recalculateTotals"
                    />
                  </q-td>
                </template>
  
                <template v-slot:body-cell-actions="props">
                  <q-td :props="props" class="text-center">
                    <q-btn
                      flat
                      round
                      color="negative"
                      icon="delete"
                      @click="removeProduct(props.row.id)"
                      size="sm"
                    />
                  </q-td>
                </template>
              </q-table>
  
              <div class="row q-col-gutter-md justify-end">
                <div class="col-12 col-md-4">
                  <q-input
                    v-model.number="entryForm.subtotal"
                    label="Subtotal"
                    filled
                    readonly
                    prefix="$"
                  />
                </div>
                <div class="col-12 col-md-4">
                  <q-input
                    v-model.number="entryForm.taxRate"
                    label="IVA (%)"
                    filled
                    type="number"
                    @input="recalculateTotals"
                  />
                </div>
                <div class="col-12 col-md-4">
                  <q-input
                    v-model.number="entryForm.total"
                    label="Total"
                    filled
                    readonly
                    prefix="$"
                    class="text-h6"
                  />
                </div>
              </div>
  
              <div class="flex justify-end q-gutter-sm q-mt-lg">
                <q-btn
                  label="Cancelar"
                  color="grey"
                  flat
                  v-close-popup
                />
                <q-btn
                  label="Guardar"
                  type="submit"
                  color="primary"
                  :loading="isSaving"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
  
      <q-table
        :rows="inventoryEntries"
        :columns="entryColumns"
        row-key="_id"
        flat
        bordered
        :loading="isLoading"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-center">
            <q-btn-group flat>
              <q-btn
                color="primary"
                icon="edit"
                @click="editEntry(props.row)"
                size="sm"
              >
                <q-tooltip>Editar devolución</q-tooltip>
              </q-btn>
              <q-btn
                :color="props.row.estado === '1' ? 'negative' : 'positive'"
                :icon="props.row.estado === '1' ? 'archive' : 'unarchive'"
                @click="toggleEntryStatus(props.row._id, props.row.estado)"
                size="sm"
                :disable="isLoading"
              >
                <q-tooltip>
                  {{ props.row.estado === '1' ? 'Archivar' : 'Activar' }}
                </q-tooltip>
              </q-btn>
            </q-btn-group>
          </q-td>
        </template>
      </q-table>
    </q-page>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useQuasar } from 'quasar';
  import { getData, postData, putData } from '../services/apiClient.js';
  
  const inventoryEntries = ref([]);
  const availableProducts = ref([]);
  const filteredProducts = ref([]);
  const showModal = ref(false);
  const isEditMode = ref(false);
  const editingId = ref(null);
  const selectedProduct = ref(null);
  const isLoading = ref(false);
  const isSaving = ref(false);
  
  const entryForm = ref({
    type: 4,
    invoiceNumber: '',
    date: '',
    products: [],
    subtotal: 0,
    taxRate: 16,
    total: 0,
    status: 1,
  });
  
  const entryColumns = [
    {
      name: 'invoiceNumber',
      label: 'N° Factura',
      field: 'numeroFactura',
      align: 'left',
      sortable: true
    },
    {
      name: 'date',
      label: 'Fecha',
      field: 'fecha',
      align: 'left',
      format: val => new Date(val).toLocaleDateString(),
      sortable: true
    },
    {
      name: 'subtotal',
      label: 'Subtotal',
      field: 'valor',
      align: 'right',
      format: val => `$${val.toLocaleString()}`,
      sortable: true
    },
    {
      name: 'total',
      label: 'Total',
      field: 'total',
      align: 'right',
      format: val => `$${val.toLocaleString()}`,
      sortable: true
    },
    {
      name: 'status',
      label: 'Estado',
      field: 'estado',
      align: 'center',
      format: val => val === '1' ? 'Activo' : 'Inactivo'
    },
    { name: 'actions', label: 'Acciones', align: 'center' }
  ];
  
  const productColumns = [
    { name: 'name', label: 'Producto', field: 'name', align: 'left' },
    { name: 'quantity', label: 'Cantidad', field: 'quantity', align: 'center' },
    { name: 'price', label: 'Precio', field: 'price', align: 'right' },
    {
      name: 'subtotal',
      label: 'Subtotal',
      field: row => row.quantity * row.price,
      align: 'right',
      format: val => `$${val.toLocaleString()}`
    },
    { name: 'actions', label: 'Acciones', align: 'center' }
  ];
  
  async function loadProducts() {
    try {
      isLoading.value = true;
      const response = await getData('articulos/activos');
      availableProducts.value = response.articulos || response;
      filteredProducts.value = availableProducts.value;
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      isLoading.value = false;
    }
  }
  
  async function loadEntries() {
    try {
      isLoading.value = true;
      const response = await getData('/movimientos/tipo/4');
      if (response && response.devolucionesSalida) {
        inventoryEntries.value = response.devolucionesSalida;
      } else {
        console.error('Formato de respuesta no válido:', response);
      }
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      isLoading.value = false;
    }
  }
  
  function filterProducts(val, update) {
    if (val === '') {
      update(() => {
        filteredProducts.value = availableProducts.value;
      });
      return;
    }
  
    update(() => {
      const needle = val.toLowerCase();
      filteredProducts.value = availableProducts.value.filter(
        product => product.nombre.toLowerCase().includes(needle)
      );
    });
  }
  
  function addProductToEntry(product) {
    if (!product || entryForm.value.products.some(p => p.id === product._id)) {
      selectedProduct.value = null;
      return;
    }
  
    entryForm.value.products.push({
      id: product._id,
      name: product.nombre,
      quantity: 1,
      price: product.precio || 0
    });
  
    selectedProduct.value = null;
    recalculateTotals();
  }
  
  function removeProduct(productId) {
    entryForm.value.products = entryForm.value.products.filter(p => p.id !== productId);
    recalculateTotals();
  }
  
  function recalculateTotals() {
    const subtotal = entryForm.value.products.reduce(
      (acc, product) => acc + (product.quantity * product.price),
      0
    );
    
    entryForm.value.subtotal = subtotal;
    entryForm.value.total = subtotal * (1 + (entryForm.value.taxRate / 100));
  }
  
  function openEntryModal() {
    resetForm();
    showModal.value = true;
  }
  
  function resetForm() {
    entryForm.value = {
      type: 4,
      invoiceNumber: '',
      date: '',
      products: [],
      subtotal: 0,
      taxRate: 16,
      total: 0,
      status: 1
    };
    isEditMode.value = false;
    editingId.value = null;
    selectedProduct.value = null;
  }
  
  function editEntry(entry) {
    isEditMode.value = true;
    editingId.value = entry._id;
    
    entryForm.value = {
      type: 4,
      invoiceNumber: entry.numeroFactura,
      date: entry.fecha,
      products: entry.articulos.map(item => ({
        id: item.id,
        name: item.nombre,
        quantity: item.cantidad,
        price: item.precio
      })),
      subtotal: entry.valor,
      taxRate: entry.iva,
      total: entry.total,
      status: entry.estado
    };
    
    showModal.value = true;
  }
  
  async function submitEntry() {
    try {
      isSaving.value = true;
  
      const entryData = {
        tipo: entryForm.value.type,
        numeroFactura: entryForm.value.invoiceNumber,
        fecha: entryForm.value.date,
        articulos: entryForm.value.products.map(item => ({
          id: item.id,
          nombre: item.name,
          cantidad: parseInt(item.quantity), 
          precio: parseFloat(item.price),     
        })),
        valor: parseFloat(entryForm.value.subtotal),
        iva: parseFloat(entryForm.value.taxRate), 
        total: parseFloat(entryForm.value.total),
        estado: entryForm.value.status.toString()  
      };
  
      const url = isEditMode.value
        ? `movimientos/actualizar/${editingId.value}`
        : 'movimientos';
  
      const response = await (isEditMode.value ? putData : postData)(url, entryData);
      console.log('Response:', response); 
  
      showModal.value = false;
      await loadEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      isSaving.value = false;
    }
  }
  
  async function toggleEntryStatus(id, currentStatus) {
    try {
      const accion = currentStatus === '1' ? 'inactivar' : 'activar';
      const url = `movimientos/${accion}/${id}`;
      isLoading.value = true;
      
      await putData(url);
      
      const entryIndex = inventoryEntries.value.findIndex(entry => entry._id === id);
      if (entryIndex !== -1) {
        inventoryEntries.value = inventoryEntries.value.map((entry, index) => {
          if (index === entryIndex) {
            return {
              ...entry,
              estado: currentStatus === '1' ? '0' : '1'
            };
          }
          return entry;
        });
      }
      
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
      await loadEntries();
    } finally {
      isLoading.value = false;
    }
  }
  
  onMounted(async () => {
    await Promise.all([
      loadProducts(),
      loadEntries()
    ]);
  });
  </script>
  
  <style scoped>
  .text-primary {
    color: var(--q-primary);
  }
  
  .q-table {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .q-dialog__inner > div {
    border-radius: 8px;
  }
  
  .q-card {
    max-height: 90vh;
    overflow: auto;
  }
  
  .q-field {
    margin-bottom: 12px;
  }
  
  .q-btn {
    font-weight: 500;
  }
  
  .text-h4 {
    font-weight: 600;
    margin-bottom: 24px;
  }
  </style>
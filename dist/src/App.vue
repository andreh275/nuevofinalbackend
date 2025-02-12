<template>
  <div class="app-container">
    <q-layout view="hHh LpR fFf">
      
      <q-header elevated class="bg-primary">
        <q-toolbar>
          <q-btn
            flat
            dense
            round
            icon="menu"
            @click="toggleLeftDrawer"
            aria-label="Menu"
          />
          
          <q-toolbar-title class="row items-center">
            <q-avatar class="q-mr-sm">
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
            </q-avatar>
            <span class="text-weight-bold">Sistema de Inventario</span>
          </q-toolbar-title>

          <q-space />
          
          
          <q-btn round flat icon="notifications">
            <q-badge color="red" floating>2</q-badge>
          </q-btn>
          
          <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup>
                  <q-item-section>Perfil</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section>Configuración</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup>
                  <q-item-section>Cerrar Sesión</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-toolbar>
      </q-header>

     
      <q-drawer
        v-model="leftDrawerOpen"
        bordered
        :width="240"
        :breakpoint="500"
        class="bg-grey-1"
      >
        <q-scroll-area class="fit">
          <q-list padding>
            <q-item-label header>Menú Principal</q-item-label>

            

            <q-expansion-item
              icon="inventory"
              label="Inventario"
              default-opened
            >
              <q-list class="q-pl-md">
                <q-item clickable v-ripple to="/articulos" active-class="menu-link-active">
                  <q-item-section avatar>
                    <q-icon name="shopping_bag" />
                  </q-item-section>
                  <q-item-section>Artículos</q-item-section>
                </q-item>

                <q-item clickable v-ripple to="/categorias" active-class="menu-link-active">
                  <q-item-section avatar>
                    <q-icon name="category" />
                  </q-item-section>
                  <q-item-section>Categorías</q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>

            <q-expansion-item
              icon="swap_horiz"
              label="Movimientos"
            >
              <q-list class="q-pl-md">
                <q-item clickable v-ripple to="/entradas" active-class="menu-link-active">
                  <q-item-section avatar>
                    <q-icon name="arrow_downward" />
                  </q-item-section>
                  <q-item-section>Entradas</q-item-section>
                </q-item>

                <q-item clickable v-ripple to="/salidas" active-class="menu-link-active">
                  <q-item-section avatar>
                    <q-icon name="arrow_upward" />
                  </q-item-section>
                  <q-item-section>Salidas</q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>

            <q-expansion-item
              icon="compare_arrows"
              label="Devoluciones"
            >
              <q-list class="q-pl-md">
                <q-item clickable v-ripple to="/Devolucionentrada" active-class="menu-link-active">
                  <q-item-section avatar>
                    <q-icon name="undo" />
                  </q-item-section>
                  <q-item-section>Devolución Entrada</q-item-section>
                </q-item>

                <q-item clickable v-ripple to="/Devolucionsalida" active-class="menu-link-active">
                  <q-item-section avatar>
                    <q-icon name="redo" />
                  </q-item-section>
                  <q-item-section>Devolución Salida</q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>

            <q-separator spaced />

            <q-item clickable v-ripple to="/clientes" active-class="menu-link-active">
              <q-item-section avatar>
                <q-icon name="people" />
              </q-item-section>
              <q-item-section>Clientes</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/Proveedor" active-class="menu-link-active">
              <q-item-section avatar>
                <q-icon name="local_shipping" />
              </q-item-section>
              <q-item-section>Proveedores</q-item-section>
            </q-item>

            <q-separator spaced />

            <q-item clickable v-ripple to="/usuarios" active-class="menu-link-active">
              <q-item-section avatar>
                <q-icon name="manage_accounts" />
              </q-item-section>
              <q-item-section>Usuarios</q-item-section>
            </q-item>

           
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <!-- Contenido principal -->
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'MainLayout',

  setup () {
    const leftDrawerOpen = ref(false)
    const route = useRoute()

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
}
</script>

<style>
.menu-link-active {
  color: #1976D2 !important;
  background: #E3F2FD !important;
  font-weight: bold;
}

.q-drawer {
  background: #f5f5f5 !important;
}

.q-item {
  border-radius: 8px;
  margin: 4px 8px;
}

.q-item:hover {
  background: #E3F2FD;
}

.q-toolbar {
  min-height: 60px;
}

.app-container {
  height: 100vh;
}
</style>
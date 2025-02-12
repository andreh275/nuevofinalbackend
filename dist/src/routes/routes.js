import Articulos from '../components/Articulos.vue'
import Categorias from '../components/Categorias.vue'
import Clientes from '../components/Clientes.vue'
import Devolucionentrada from '../components/Devolucionentrada.vue'
import Devolucionsalida from '../components/Devolucionsalida.vue'
import Usuarios from '../components/Usuarios.vue'
import Entradas from '../components/Entradas.vue'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Proveedor from '../components/Proveedor.vue'
import Salidas from '../components/Salidas.vue'




import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login

    },
    {
        path: '/Salidas',
        name: 'Salidas',
        component: Salidas

    },
    {
        path: '/Proveedor',
        name: 'Proveedor',
        component: Proveedor

    },
    {
        path:'/Entradas',
        name:'Entradas',
        component:Entradas
    },
    {
        path:'/Devolucionentrada',
        name:'Devolucionentrada',
        component:Devolucionentrada
    },
    {
        path:'/Devolucionsalida',
        name:'Devolucionsalida',
        component:Devolucionsalida

    },
    {
      path: "/Clientes" ,       
      name: 'Clientes',
      component: Clientes
    },
    {
        path: '/Articulos',
        name: 'Articulos',
        component: Articulos
    },
    {
        path: '/Categorias',
        name: 'Categorias',
        component: Categorias
    },
    
    {
        path: '/Usuarios',
        name: 'Usuarios',
        component: Usuarios
    },
    
    {
        path: '/Home',
        name: 'Home',
        component: Home,
        children: [
            
        ]
    }
]
export const router = createRouter({
    history: createWebHashHistory(),
    routes
})
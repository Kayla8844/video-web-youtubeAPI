import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/storage',
        name: 'Storage',
        component: () =>
            import ('../components/storage.vue')
    },
    {
        path: '/play/:video_id',
        name: 'Play',
        component: () =>
            import ('../components/play.vue')
    },
    {
        path: '/play_specify',
        name: 'Play_specify',
        component: () =>
            import ('../components/play_specify.vue')
    }
]

const router = new VueRouter({
    routes
})

export default router
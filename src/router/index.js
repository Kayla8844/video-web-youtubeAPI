import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '*',
        redirect: '/',
    },
    {
        path: '/',
        name: 'Home',
        meta: {
            keepAlive: true // 需要缓存
        },
        component: () =>
            import ('../components/Home.vue')
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
    mode: 'hash',
    routes
})

export default router
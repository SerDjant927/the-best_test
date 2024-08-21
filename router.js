import { createRouter, createWebHistory } from 'vue-router';
import DetailPage from '@/components/DetailPage.vue';
import TendersList from '@/components/TendersList.vue';
let routes = [
    {
        path: '/',
        name: 'TendersList',
        component: TendersList,
    },
    {
        path: '/tender/:id', 
        name: 'DetailPage',
        component: DetailPage,
    },
];

let router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

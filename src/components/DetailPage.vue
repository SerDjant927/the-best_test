<template>

    <div v-if="loading" class="preloader">Загрузка...</div>
    <div v-else name="fade">
        <Transition name="fade">
            <div class="detail-page" v-if="tender">
                <router-link to="/" class="back-button">Назад</router-link>
                <h1>{{ tender.title }}</h1>
                <p>{{ tender.description }}</p>
            </div>
        </Transition>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

interface TenderDetail {
    id: string;
    title: string;
    description: string;
}

export default defineComponent({
    name: 'DetailPage',
    setup() {
        let loading = ref(true);
        let route = useRoute();
        let tenderId = Number(route.params.id);
        let tender = ref<TenderDetail | null>(null);
        let fetchTenderDetails = async () => {
            try {
                console.log(`Запрос к API для тендера с ID: ${tenderId}`);
                let response = await fetch(`https://api.test-webest.ru/list/?id=${tenderId}`);
                if (!response.ok) {
                    throw new Error('Ошибка при получении данных');
                }
                let data = await response.json();
                tender.value = data.data.find((tender: TenderDetail) => tender.id === String(tenderId));
                loading.value = false;
            } catch (error) {
                console.error('Ошибка при получении деталей тендера:', error);
            }
        };
        onMounted(() => {
            fetchTenderDetails();
        });

        return {
            tender,
            loading
        };
    },
});
</script>

<style>
.preloader {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    font-weight: bold;
    font-size: 72px;
}

.back-button {
    display: inline-block;
    margin-bottom: 20px;
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 5px;
}

.back-button:hover {
    background-color: #0056b3;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 3.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
